from django.db import models
from django.contrib.auth.models import User
from tenants.models import Tenant
from Accounts.models import Product
from django_multitenant.mixins import TenantModelMixin
from django_multitenant.models import TenantManagerMixin

class ForecastManager(TenantManagerMixin, models.Manager):
    pass

class ForecastModel(TenantModelMixin, models.Model):
    """
    Model for storing forecasting model configurations
    """
    MODEL_TYPES = (
        ('moving_avg', 'Moving Average'),
        ('exp_smoothing', 'Exponential Smoothing'),
        ('arima', 'ARIMA'),
        ('prophet', 'Prophet'),
        ('lstm', 'LSTM Neural Network'),
    )
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPES)
    
    # JSON configuration for the model parameters
    parameters = models.JSONField(default=dict)
    
    # User who created the model
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_forecast_models')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Performance metrics
    accuracy = models.FloatField(null=True, blank=True)
    mape = models.FloatField(null=True, blank=True)  # Mean Absolute Percentage Error
    rmse = models.FloatField(null=True, blank=True)  # Root Mean Square Error
    
    objects = ForecastManager()
    
    class Meta:
        ordering = ['-updated_at']
        unique_together = (('tenant', 'name'),)
    
    def __str__(self):
        return f"{self.name} ({self.get_model_type_display()})"

class ProductForecast(models.Model):
    """
    Model for storing product-specific forecasts
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='forecasts')
    forecast_model = models.ForeignKey(ForecastModel, on_delete=models.CASCADE, related_name='product_forecasts')
    
    # Forecast period
    start_date = models.DateField()
    end_date = models.DateField()
    
    # JSON data with the forecast values
    forecast_data = models.JSONField()
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Accuracy metrics for this specific forecast
    accuracy = models.FloatField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Forecast for {self.product.name} ({self.start_date} to {self.end_date})"

class InventoryAlert(TenantModelMixin, models.Model):
    """
    Model for storing inventory alerts
    """
    ALERT_TYPES = (
        ('low_stock', 'Low Stock'),
        ('stockout', 'Stockout Risk'),
        ('overstock', 'Overstock Risk'),
        ('expiry', 'Expiry Risk'),
        ('price', 'Price Alert'),
    )
    
    ALERT_LEVELS = (
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    )
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventory_alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    level = models.CharField(max_length=10, choices=ALERT_LEVELS, default='warning')
    
    message = models.TextField()
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # User who resolved the alert
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_alerts')
    
    objects = ForecastManager()
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_alert_type_display()} for {self.product.name}"
    
    def resolve(self, user):
        """Mark the alert as resolved"""
        from django.utils import timezone
        self.is_active = False
        self.resolved_at = timezone.now()
        self.resolved_by = user
        self.save()

class OptimizationRule(TenantModelMixin, models.Model):
    """
    Model for storing inventory optimization rules
    """
    RULE_TYPES = (
        ('min_stock', 'Minimum Stock Level'),
        ('max_stock', 'Maximum Stock Level'),
        ('reorder_point', 'Reorder Point'),
        ('order_quantity', 'Order Quantity'),
        ('safety_stock', 'Safety Stock'),
    )
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    
    # The rule can apply to all products or specific ones
    is_global = models.BooleanField(default=False)
    products = models.ManyToManyField(Product, related_name='optimization_rules', blank=True)
    
    # Rule parameters
    parameters = models.JSONField(default=dict)
    
    # Is the rule active?
    is_active = models.BooleanField(default=True)
    
    # User who created the rule
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_optimization_rules')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = ForecastManager()
    
    class Meta:
        ordering = ['-updated_at']
        unique_together = (('tenant', 'name'),)
    
    def __str__(self):
        return f"{self.name} ({self.get_rule_type_display()})"