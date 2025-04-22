from django.contrib.auth.backends import ModelBackend
from django_multitenant.utils import set_current_tenant
from .models import UserProfile, Tenant

class TenantAwareBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        user = super().authenticate(request, username=username, password=password, **kwargs)
        
        if user and hasattr(request, 'tenant'):
            # Check if user belongs to the current tenant
            try:
                profile = UserProfile.objects.get(user=user, tenant=request.tenant)
                set_current_tenant(request.tenant)
                return user
            except UserProfile.DoesNotExist:
                return None
        
        return user

    def get_user(self, user_id):
        user = super().get_user(user_id)
        if user and hasattr(user, 'request') and hasattr(user.request, 'tenant'):
            try:
                # Verify the user belongs to the current tenant
                UserProfile.objects.get(user=user, tenant=user.request.tenant)
                return user
            except UserProfile.DoesNotExist:
                return None
        return user 