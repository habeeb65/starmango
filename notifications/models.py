from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from tenants.models import Tenant
from django_multitenant.mixins import TenantModelMixin
from django_multitenant.models import TenantManagerMixin

class NotificationManager(TenantManagerMixin, models.Manager):
    pass

class Notification(TenantModelMixin, models.Model):
    """
    Model for storing notifications
    """
    NOTIFICATION_TYPES = (
        ('payment', 'Payment'),
        ('invoice', 'Invoice'),
        ('product', 'Product'),
        ('system', 'System'),
    )
    
    NOTIFICATION_LEVELS = (
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    )
    
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    level = models.CharField(max_length=10, choices=NOTIFICATION_LEVELS, default='info')
    title = models.CharField(max_length=255)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Generic relation to the related object
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # URL to redirect to when notification is clicked
    action_url = models.CharField(max_length=255, blank=True, null=True)
    
    objects = NotificationManager()
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.recipient.username}"
    
    def mark_as_read(self):
        self.read = True
        self.save()