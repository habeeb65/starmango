from django.db import models
from django.contrib.auth.models import User

class Tenant(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # Business-specific fields
    business_type = models.CharField(max_length=50, choices=[
        ('mango', 'Mango Wholesaler'),
        ('vegetable', 'Vegetable Wholesaler'),
        ('fruit', 'Mixed Fruit Wholesaler'),
    ], default='mango')
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    primary_color = models.CharField(max_length=7, default='#00897B')  # Default teal color
    
    # Required for django-multitenant
    tenant_id = 'id'
    
    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    is_tenant_admin = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} ({self.tenant.name})"

class TenantSettings(models.Model):
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='settings')
    enable_purchase_management = models.BooleanField(default=True)
    enable_sales_management = models.BooleanField(default=True)
    enable_credit_dashboard = models.BooleanField(default=True)
    dashboard_layout = models.CharField(max_length=20, default='standard')
    
    def __str__(self):
        return f"Settings for {self.tenant.name}" 