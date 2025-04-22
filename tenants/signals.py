from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Tenant, TenantSettings, UserProfile
from django.contrib.auth.models import User
from django_multitenant.utils import set_current_tenant

@receiver(post_save, sender=Tenant)
def create_tenant_settings(sender, instance, created, **kwargs):
    """Create settings for a new tenant"""
    if created:
        TenantSettings.objects.create(tenant=instance)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Create a UserProfile for new users that don't already have one
    This is mainly for superusers created via management commands
    """
    if created and not hasattr(instance, 'profile'):
        # Check if there's at least one tenant
        tenants = Tenant.objects.all()
        if tenants.exists():
            # Link user to the first tenant as default
            UserProfile.objects.create(
                user=instance,
                tenant=tenants.first(),
                is_tenant_admin=instance.is_superuser
            ) 