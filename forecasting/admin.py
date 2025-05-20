from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib import messages
from django.utils.html import format_html
from django.contrib.admin.views.decorators import staff_member_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.db.models import Sum, Count, Avg, F, Q
from django.utils import timezone
from datetime import datetime, timedelta
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64

from .models import ForecastModel, ProductForecast, InventoryAlert, OptimizationRule
from .forecasting import get_forecaster
from Accounts.models import Product
from tenants.models import Tenant

class ForecastModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'model_type', 'created_by', 'created_at', 'accuracy', 'actions_buttons')
    list_filter = ('model_type', 'created_at')
    search_fields = ('name', 'description', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at', 'accuracy', 'mape', 'rmse')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Filter by tenant
        try:
            profile = request.user.profile
            return qs.filter(tenant=profile.tenant)
        except:
            return qs.none()
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set these on creation
            obj.created_by = request.user
            try:
                obj.tenant = request.user.profile.tenant
            except:
                pass
        super().save_model(request, obj, form, change)
    
    def actions_buttons(self, obj):
        return format_html(
            '<a class="button" href="{}">Run Forecast</a> '
            '<a class="button" href="{}">View Results</a>',
            f'/admin/forecasting/run-forecast/{obj.id}/',
            f'/admin/forecasting/view-forecast/{obj.id}/'
        )
    actions_buttons.short_description = 'Actions'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('run-forecast/<int:model_id>/', self.admin_site.admin_view(self.run_forecast_view), name='run-forecast'),
            path('view-forecast/<int:model_id>/', self.admin_site.admin_view(self.view_forecast_view), name='view-forecast'),
        ]
        return custom_urls + urls
    
    @method_decorator(staff_member_required)
    def run_forecast_view(self, request, model_id):
        forecast_model = ForecastModel.objects.get(id=model_id)
        
        # Get tenant for the current user
        tenant = None
        try:
            tenant = request.user.profile.tenant
        except:
            if request.user.is_superuser:
                tenant = forecast_model.tenant
        
        if not tenant:
            messages.error(request, "No tenant found. Please create a tenant first.")
            return redirect('admin:forecasting_forecastmodel_changelist')
        
        # Get all products for this tenant
        products = Product.objects.filter(tenant=tenant)
        
        if request.method == 'POST':
            product_ids = request.POST.getlist('products')
            forecast_days = int(request.POST.get('forecast_days', 30))
            
            if not product_ids:
                messages.error(request, "Please select at least one product.")
                return redirect('admin:run-forecast', model_id=model_id)
            
            # Run forecast for each selected product
            results = []
            for product_id in product_ids:
                product = Product.objects.get(id=product_id)
                
                # Get the appropriate forecaster
                forecaster = get_forecaster(
                    forecast_model.model_type,
                    product=product,
                    forecast_days=forecast_days,
                    **forecast_model.parameters
                )
                
                # Generate forecast
                forecaster.generate_forecast()
                
                # Save forecast
                product_forecast = forecaster.save_forecast(forecast_model)
                
                # Generate alerts
                alerts = forecaster.generate_alerts()
                
                results.append({
                    'product': product.name,
                    'forecast': forecaster.forecast.tolist() if isinstance(forecaster.forecast, np.ndarray) else forecaster.forecast,
                    'alerts': [a.message for a in alerts]
                })
            
            messages.success(request, f"Forecast generated for {len(results)} products.")
            return redirect('admin:view-forecast', model_id=model_id)
        
        context = {
            'forecast_model': forecast_model,
            'products': products,
            'title': f'Run Forecast: {forecast_model.name}',
            'opts': self.model._meta,
        }
        return render(request, 'admin/forecasting/run_forecast.html', context)
    
    @method_decorator(staff_member_required)
    def view_forecast_view(self, request, model_id):
        forecast_model = ForecastModel.objects.get(id=model_id)
        
        # Get all forecasts for this model
        forecasts = ProductForecast.objects.filter(forecast_model=forecast_model).order_by('-created_at')
        
        # Group by product
        product_forecasts = {}
        for forecast in forecasts:
            if forecast.product.name not in product_forecasts:
                product_forecasts[forecast.product.name] = []
            product_forecasts[forecast.product.name].append(forecast)
        
        # Generate charts for each product
        charts = {}
        for product_name, product_forecast_list in product_forecasts.items():
            if product_forecast_list:
                latest_forecast = product_forecast_list[0]
                
                # Create a chart
                fig, ax = plt.subplots(figsize=(10, 6))
                
                # Extract forecast data
                forecast_data = latest_forecast.forecast_data
                dates = [datetime.fromisoformat(d) for d in forecast_data['dates']]
                values = forecast_data['values']
                
                # Plot the forecast
                ax.plot(dates, values, 'b-', label='Forecast')
                
                # Plot confidence intervals if available
                if 'lower_bound' in forecast_data and 'upper_bound' in forecast_data:
                    lower_bound = forecast_data['lower_bound']
                    upper_bound = forecast_data['upper_bound']
                    ax.fill_between(dates, lower_bound, upper_bound, color='b', alpha=0.2)
                
                ax.set_title(f'Forecast for {product_name}')
                ax.set_xlabel('Date')
                ax.set_ylabel('Quantity')
                ax.legend()
                ax.grid(True)
                
                # Save the chart to a buffer
                buffer = io.BytesIO()
                fig.savefig(buffer, format='png')
                buffer.seek(0)
                
                # Convert to base64 for embedding in HTML
                chart_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
                charts[product_name] = chart_data
                
                plt.close(fig)
        
        context = {
            'forecast_model': forecast_model,
            'product_forecasts': product_forecasts,
            'charts': charts,
            'title': f'Forecast Results: {forecast_model.name}',
            'opts': self.model._meta,
        }
        return render(request, 'admin/forecasting/view_forecast.html', context)


class ProductForecastAdmin(admin.ModelAdmin):
    list_display = ('product', 'forecast_model', 'start_date', 'end_date', 'created_at', 'accuracy')
    list_filter = ('forecast_model', 'start_date', 'created_at')
    search_fields = ('product__name', 'forecast_model__name')
    readonly_fields = ('created_at', 'updated_at', 'accuracy', 'forecast_data')
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Filter by tenant
        try:
            profile = request.user.profile
            return qs.filter(product__tenant=profile.tenant)
        except:
            return qs.none()


class InventoryAlertAdmin(admin.ModelAdmin):
    list_display = ('product', 'alert_type', 'level', 'is_active', 'created_at', 'resolved_at')
    list_filter = ('alert_type', 'level', 'is_active', 'created_at')
    search_fields = ('product__name', 'message')
    readonly_fields = ('created_at', 'resolved_at', 'resolved_by')
    actions = ['resolve_alerts']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Filter by tenant
        try:
            profile = request.user.profile
            return qs.filter(tenant=profile.tenant)
        except:
            return qs.none()
    
    def resolve_alerts(self, request, queryset):
        for alert in queryset:
            alert.resolve(request.user)
        self.message_user(request, f"{queryset.count()} alerts have been resolved.")
    resolve_alerts.short_description = "Mark selected alerts as resolved"


class OptimizationRuleAdmin(admin.ModelAdmin):
    list_display = ('name', 'rule_type', 'is_global', 'is_active', 'created_by', 'created_at')
    list_filter = ('rule_type', 'is_global', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('products',)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        # Filter by tenant
        try:
            profile = request.user.profile
            return qs.filter(tenant=profile.tenant)
        except:
            return qs.none()
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set these on creation
            obj.created_by = request.user
            try:
                obj.tenant = request.user.profile.tenant
            except:
                pass
        super().save_model(request, obj, form, change)


# Register models
admin.site.register(ForecastModel, ForecastModelAdmin)
admin.site.register(ProductForecast, ProductForecastAdmin)
admin.site.register(InventoryAlert, InventoryAlertAdmin)
admin.site.register(OptimizationRule, OptimizationRuleAdmin)


# Add forecasting dashboard view
@staff_member_required
def forecasting_dashboard_view(request):
    """Main forecasting dashboard view"""
    
    # Get tenant for the current user
    tenant = None
    try:
        tenant = request.user.profile.tenant
    except:
        if request.user.is_superuser:
            # For superusers, use the first tenant or allow selection
            tenant = Tenant.objects.first()
    
    if not tenant:
        messages.error(request, "No tenant found. Please create a tenant first.")
        return redirect('admin:index')
    
    # Get active alerts
    active_alerts = InventoryAlert.objects.filter(tenant=tenant, is_active=True).order_by('-level', '-created_at')
    
    # Get recent forecasts
    recent_forecasts = ProductForecast.objects.filter(
        product__tenant=tenant
    ).order_by('-created_at')[:10]
    
    # Get forecast models
    forecast_models = ForecastModel.objects.filter(tenant=tenant)
    
    # Get optimization rules
    optimization_rules = OptimizationRule.objects.filter(tenant=tenant, is_active=True)
    
    context = {
        'title': 'Forecasting Dashboard',
        'tenant': tenant,
        'active_alerts': active_alerts,
        'recent_forecasts': recent_forecasts,
        'forecast_models': forecast_models,
        'optimization_rules': optimization_rules,
    }
    
    return render(request, 'admin/forecasting/dashboard.html', context)

# Instead of using admin.site.register_view which requires django-admin-tools
# We'll add this view to urls.py instead
# Comment out the following line:
# admin.site.register_view('forecasting/dashboard/', view=forecasting_dashboard_view, name='Forecasting Dashboard')