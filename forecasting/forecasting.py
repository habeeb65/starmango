import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from django.db.models import Sum, Avg, Count, F, Q
from django.utils import timezone
from Accounts.models import PurchaseInvoice, PurchaseProduct, Product
from .models import ForecastModel, ProductForecast, InventoryAlert

class BaseForecaster:
    """Base class for forecasting models"""
    
    def __init__(self, product, start_date=None, end_date=None, **kwargs):
        self.product = product
        self.start_date = start_date or (timezone.now() - timedelta(days=365)).date()  # Default to last year
        self.end_date = end_date or timezone.now().date()
        self.forecast_days = kwargs.get('forecast_days', 30)  # Default to 30 days forecast
        self.kwargs = kwargs
        self.data = None
        self.forecast = None
    
    def prepare_data(self):
        """Prepare historical data for forecasting"""
        # Get all purchase products for this product
        purchase_products = PurchaseProduct.objects.filter(
            product=self.product,
            invoice__date__gte=self.start_date,
            invoice__date__lte=self.end_date
        ).select_related('invoice')
        
        # Create a DataFrame with daily quantities
        data = []
        for pp in purchase_products:
            data.append({
                'date': pp.invoice.date,
                'quantity': pp.quantity
            })
        
        if not data:
            # No data available
            return pd.DataFrame(columns=['date', 'quantity'])
        
        df = pd.DataFrame(data)
        
        # Aggregate by date
        df = df.groupby('date')['quantity'].sum().reset_index()
        
        # Sort by date
        df = df.sort_values('date')
        
        # Set date as index
        df.set_index('date', inplace=True)
        
        # Resample to daily frequency, filling missing dates with 0
        df = df.resample('D').sum().fillna(0)
        
        self.data = df
        return df
    
    def generate_forecast(self):
        """Generate forecast - to be implemented by subclasses"""
        raise NotImplementedError("Subclasses must implement generate_forecast()")
    
    def save_forecast(self, forecast_model):
        """Save the forecast to the database"""
        if self.forecast is None:
            self.generate_forecast()
        
        # Calculate forecast period
        forecast_start = self.end_date + timedelta(days=1)
        forecast_end = forecast_start + timedelta(days=len(self.forecast) - 1)
        
        # Create or update the product forecast
        product_forecast, created = ProductForecast.objects.update_or_create(
            product=self.product,
            forecast_model=forecast_model,
            start_date=forecast_start,
            end_date=forecast_end,
            defaults={
                'forecast_data': {
                    'dates': [(forecast_start + timedelta(days=i)).isoformat() for i in range(len(self.forecast))],
                    'values': self.forecast.tolist() if isinstance(self.forecast, np.ndarray) else self.forecast,
                    'lower_bound': getattr(self, 'lower_bound', []).tolist() if hasattr(self, 'lower_bound') and isinstance(self.lower_bound, np.ndarray) else getattr(self, 'lower_bound', []),
                    'upper_bound': getattr(self, 'upper_bound', []).tolist() if hasattr(self, 'upper_bound') and isinstance(self.upper_bound, np.ndarray) else getattr(self, 'upper_bound', []),
                },
                'accuracy': getattr(self, 'accuracy', None)
            }
        )
        
        return product_forecast
    
    def generate_alerts(self, threshold_days=7, low_stock_threshold=10):
        """Generate inventory alerts based on forecast"""
        if self.forecast is None:
            self.generate_forecast()
        
        alerts = []
        
        # Check for stockout risk
        stockout_days = np.where(self.forecast <= 0)[0]
        if len(stockout_days) > 0 and stockout_days[0] < threshold_days:
            # Create stockout alert
            alert = InventoryAlert(
                tenant=self.product.tenant,
                product=self.product,
                alert_type='stockout',
                level='critical',
                message=f"Stockout risk in {stockout_days[0] + 1} days for {self.product.name}. Immediate action required."
            )
            alert.save()
            alerts.append(alert)
        
        # Check for low stock risk
        low_stock_days = np.where(self.forecast <= low_stock_threshold)[0]
        if len(low_stock_days) > 0 and low_stock_days[0] < threshold_days and len(stockout_days) == 0:
            # Create low stock alert
            alert = InventoryAlert(
                tenant=self.product.tenant,
                product=self.product,
                alert_type='low_stock',
                level='warning',
                message=f"Low stock warning in {low_stock_days[0] + 1} days for {self.product.name}. Current forecast: {self.forecast[low_stock_days[0]]:.2f} units."
            )
            alert.save()
            alerts.append(alert)
        
        return alerts


class MovingAverageForecaster(BaseForecaster):
    """Simple Moving Average forecasting model"""
    
    def generate_forecast(self):
        if self.data is None:
            self.prepare_data()
        
        window = self.kwargs.get('window', 7)  # Default to 7-day moving average
        
        # Calculate moving average
        ma = self.data['quantity'].rolling(window=window).mean()
        
        # Use the last value for forecasting
        last_ma = ma.iloc[-1] if not ma.empty and not np.isnan(ma.iloc[-1]) else self.data['quantity'].mean()
        
        # Generate forecast
        self.forecast = np.array([last_ma] * self.forecast_days)
        
        # Calculate simple confidence intervals (mean ± 1.96 * std)
        std = self.data['quantity'].std()
        self.lower_bound = np.maximum(0, self.forecast - 1.96 * std)  # Ensure non-negative
        self.upper_bound = self.forecast + 1.96 * std
        
        return self.forecast


class ExponentialSmoothingForecaster(BaseForecaster):
    """Exponential Smoothing forecasting model"""
    
    def generate_forecast(self):
        if self.data is None:
            self.prepare_data()
        
        alpha = self.kwargs.get('alpha', 0.3)  # Smoothing factor
        
        # Initialize with the first value
        if self.data.empty:
            self.forecast = np.zeros(self.forecast_days)
            self.lower_bound = np.zeros(self.forecast_days)
            self.upper_bound = np.zeros(self.forecast_days)
            return self.forecast
        
        smoothed = [self.data['quantity'].iloc[0]]
        
        # Apply exponential smoothing
        for i in range(1, len(self.data)):
            smoothed.append(alpha * self.data['quantity'].iloc[i] + (1 - alpha) * smoothed[i-1])
        
        # Use the last smoothed value for forecasting
        last_smoothed = smoothed[-1]
        
        # Generate forecast
        self.forecast = np.array([last_smoothed] * self.forecast_days)
        
        # Calculate confidence intervals
        errors = self.data['quantity'].values - np.array(smoothed)
        rmse = np.sqrt(np.mean(errors**2))
        
        self.lower_bound = np.maximum(0, self.forecast - 1.96 * rmse)  # Ensure non-negative
        self.upper_bound = self.forecast + 1.96 * rmse
        
        return self.forecast


def get_forecaster(model_type, **kwargs):
    """Factory function to get the appropriate forecaster"""
    forecasters = {
        'moving_avg': MovingAverageForecaster,
        'exp_smoothing': ExponentialSmoothingForecaster,
        # Add more forecasters as they are implemented
    }
    
    forecaster_class = forecasters.get(model_type)
    if forecaster_class is None:
        raise ValueError(f"Unknown forecaster type: {model_type}")
    
    return forecaster_class(**kwargs)