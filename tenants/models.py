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
        ('grocery', 'Grocery Wholesaler'),
        ('other', 'Other Wholesaler'),
    ], default='mango')
    
    # Contact information
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, default='India')
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    
    # Branding
    logo = models.ImageField(upload_to='tenant_logos/', null=True, blank=True)
    favicon = models.ImageField(upload_to='tenant_favicons/', null=True, blank=True)
    primary_color = models.CharField(max_length=7, default='#00897B')  # Default teal color
    
    # Subscription and billing
    subscription_plan = models.CharField(max_length=50, default='free', choices=[
        ('free', 'Free Plan'),
        ('basic', 'Basic Plan'),
        ('premium', 'Premium Plan'),
        ('enterprise', 'Enterprise Plan'),
    ])
    subscription_start_date = models.DateField(null=True, blank=True)
    subscription_end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Required for django-multitenant
    tenant_id = 'id'
    
    def __str__(self):
        return self.name
        
    def save(self, *args, **kwargs):
        # Create default settings when tenant is created
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        if is_new:
            TenantSettings.objects.create(tenant=self)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    is_tenant_admin = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} ({self.tenant.name})"

class TenantSettings(models.Model):
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE, related_name='settings')
    
    # Feature flags
    enable_purchase_management = models.BooleanField(default=True)
    enable_sales_management = models.BooleanField(default=True)
    enable_credit_dashboard = models.BooleanField(default=True)
    enable_analytics = models.BooleanField(default=True)
    enable_forecasting = models.BooleanField(default=False)
    enable_notifications = models.BooleanField(default=True)
    enable_mobile_app = models.BooleanField(default=True)
    
    # UI customization
    dashboard_layout = models.CharField(max_length=20, default='standard')
    secondary_color = models.CharField(max_length=7, default='#FFA000')
    accent_color = models.CharField(max_length=7, default='#FF5722')
    custom_css = models.TextField(blank=True, null=True)
    
    # Localization settings
    default_language = models.CharField(max_length=10, default='en')
    default_currency = models.CharField(max_length=3, default='INR')
    date_format = models.CharField(max_length=20, default='DD/MM/YYYY')
    
    # Business settings
    business_hours_start = models.TimeField(default='09:00')
    business_hours_end = models.TimeField(default='18:00')
    weekend_days = models.CharField(max_length=20, default='0,6')  # 0=Monday, 6=Sunday
    
    def __str__(self):
        return f"Settings for {self.tenant.name}" 