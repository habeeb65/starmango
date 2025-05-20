from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from Accounts.models import Payment, PurchaseInvoice, PurchaseProduct
from tenants.models import UserProfile
from .models import Notification
import json

@receiver(post_save, sender=Payment)
def payment_notification(sender, instance, created, **kwargs):
    """
    Create notification when a payment is created or updated
    """
    if created:
        # Get the tenant from the invoice
        tenant = instance.invoice.tenant
        
        # Find all tenant admins for this tenant
        admin_profiles = UserProfile.objects.filter(tenant=tenant, is_tenant_admin=True)
        
        for profile in admin_profiles:
            # Create notification for each admin
            notification = Notification.objects.create(
                tenant=tenant,
                recipient=profile.user,
                notification_type='payment',
                level='success',
                title='New Payment Received',
                message=f'Payment of ₹{instance.amount} received for invoice {instance.invoice.invoice_number}',
                content_type=instance._meta.app_label,
                object_id=instance.id,
                action_url=f'/admin/Accounts/payment/{instance.id}/change/'
            )
            
            # Send real-time notification
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'user_{profile.user.id}',
                {
                    'type': 'notification_message',
                    'message': {
                        'id': notification.id,
                        'title': notification.title,
                        'message': notification.message,
                        'level': notification.level,
                        'timestamp': notification.created_at.isoformat(),
                        'url': notification.action_url
                    }
                }
            )

@receiver(post_save, sender=PurchaseInvoice)
def invoice_notification(sender, instance, created, **kwargs):
    """
    Create notification when an invoice is created
    """
    if created:
        # Get the tenant
        tenant = instance.tenant
        
        # Find all tenant admins for this tenant
        admin_profiles = UserProfile.objects.filter(tenant=tenant, is_tenant_admin=True)
        
        for profile in admin_profiles:
            # Create notification for each admin
            notification = Notification.objects.create(
                tenant=tenant,
                recipient=profile.user,
                notification_type='invoice',
                level='info',
                title='New Purchase Invoice Created',
                message=f'Invoice {instance.invoice_number} created for vendor {instance.vendor.name}',
                content_type=instance._meta.app_label,
                object_id=instance.id,
                action_url=f'/admin/Accounts/purchaseinvoice/{instance.id}/change/'
            )
            
            # Send real-time notification
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'user_{profile.user.id}',
                {
                    'type': 'notification_message',
                    'message': {
                        'id': notification.id,
                        'title': notification.title,
                        'message': notification.message,
                        'level': notification.level,
                        'timestamp': notification.created_at.isoformat(),
                        'url': notification.action_url
                    }
                }
            )

@receiver(post_save, sender=PurchaseProduct)
def low_inventory_notification(sender, instance, **kwargs):
    """
    Create notification when inventory is low
    """
    # Check if this is a product with low quantity (less than 10)
    if instance.quantity < 10:
        # Get the tenant
        tenant = instance.invoice.tenant
        
        # Find all tenant admins for this tenant
        admin_profiles = UserProfile.objects.filter(tenant=tenant, is_tenant_admin=True)
        
        for profile in admin_profiles:
            # Create notification for each admin
            notification = Notification.objects.create(
                tenant=tenant,
                recipient=profile.user,
                notification_type='product',
                level='warning',
                title='Low Inventory Alert',
                message=f'Product {instance.product.name} has low inventory: {instance.quantity} units remaining',
                content_type=instance._meta.app_label,
                object_id=instance.id,
                action_url=f'/admin/Accounts/purchaseproduct/{instance.id}/change/'
            )
            
            # Send real-time notification
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'user_{profile.user.id}',
                {
                    'type': 'notification_message',
                    'message': {
                        'id': notification.id,
                        'title': notification.title,
                        'message': notification.message,
                        'level': notification.level,
                        'timestamp': notification.created_at.isoformat(),
                        'url': notification.action_url
                    }
                }
            )