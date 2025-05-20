from django.db import models
from django.contrib.auth.models import User
from tenants.models import Tenant
from django_multitenant.mixins import TenantModelMixin
from django_multitenant.models import TenantManagerMixin

class ReportManager(TenantManagerMixin, models.Manager):
    pass

class SavedReport(TenantModelMixin, models.Model):
    """
    Model for storing saved report configurations
    """
    REPORT_TYPES = (
        ('sales', 'Sales Report'),
        ('inventory', 'Inventory Report'),
        ('payments', 'Payments Report'),
        ('vendors', 'Vendors Report'),
        ('customers', 'Customers Report'),
        ('profit', 'Profit Analysis'),
        ('custom', 'Custom Report'),
    )
    
    EXPORT_FORMATS = (
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
    )
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    
    # JSON configuration for the report
    configuration = models.JSONField(default=dict)
    
    # Default export format
    default_format = models.CharField(max_length=10, choices=EXPORT_FORMATS, default='pdf')
    
    # User who created the report
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_reports')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Sharing settings
    is_public = models.BooleanField(default=False)
    shared_with = models.ManyToManyField(User, related_name='shared_reports', blank=True)
    
    objects = ReportManager()
    
    class Meta:
        ordering = ['-updated_at']
        unique_together = (('tenant', 'name'),)
    
    def __str__(self):
        return f"{self.name} ({self.get_report_type_display()})"

class ReportSchedule(models.Model):
    """
    Model for scheduling automatic report generation and delivery
    """
    FREQUENCY_CHOICES = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
    )
    
    WEEKDAY_CHOICES = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )
    
    report = models.ForeignKey(SavedReport, on_delete=models.CASCADE, related_name='schedules')
    
    # Schedule configuration
    is_active = models.BooleanField(default=True)
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    
    # For weekly reports
    weekday = models.IntegerField(choices=WEEKDAY_CHOICES, null=True, blank=True)
    
    # For monthly/quarterly reports
    day_of_month = models.IntegerField(null=True, blank=True)
    
    # Time to run the report
    time = models.TimeField()
    
    # Recipients
    recipients = models.ManyToManyField(User, related_name='report_subscriptions')
    additional_emails = models.TextField(blank=True, null=True, 
                                        help_text="Additional email addresses (comma-separated)")
    
    # Last run information
    last_run = models.DateTimeField(null=True, blank=True)
    last_status = models.CharField(max_length=50, null=True, blank=True)
    
    class Meta:
        ordering = ['frequency', 'time']
    
    def __str__(self):
        return f"Schedule for {self.report.name} ({self.get_frequency_display()})"

class Dashboard(TenantModelMixin, models.Model):
    """
    Model for storing custom dashboard configurations
    """
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    
    # JSON configuration for the dashboard layout and widgets
    configuration = models.JSONField(default=dict)
    
    # User who created the dashboard
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_dashboards')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Sharing settings
    is_public = models.BooleanField(default=False)
    shared_with = models.ManyToManyField(User, related_name='shared_dashboards', blank=True)
    
    # Is this the default dashboard for the user?
    is_default = models.BooleanField(default=False)
    
    objects = ReportManager()
    
    class Meta:
        ordering = ['-updated_at']
        unique_together = (('tenant', 'name'),)
    
    def __str__(self):
        return f"{self.name} Dashboard"
    
    def save(self, *args, **kwargs):
        # If this dashboard is set as default, unset any other default dashboards for this user
        if self.is_default:
            Dashboard.objects.filter(
                created_by=self.created_by, 
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
        
        super().save(*args, **kwargs)