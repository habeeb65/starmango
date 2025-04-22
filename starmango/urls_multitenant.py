"""
This file demonstrates how to modify your project's urls.py to support
tenant-specific URLs using a URL-path approach.
"""

from django.urls import path, include
from django.contrib import admin

# Public URLs (not tenant-specific)
public_urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('tenants/', include('tenants.urls', namespace='tenants')),
    
    # Root URL redirects to tenant selector
    path('', include('tenants.urls', namespace='tenants_root')),
]

# Tenant-specific URLs - these will be prefixed with the tenant slug
tenant_urlpatterns = [
    # Use the same URL patterns, but with tenant slug prefix
    path('<slug:tenant_slug>/', include('Accounts.urls')),
    
    # Tenant-specific admin url - if you need separate admin per tenant
    # path('<slug:tenant_slug>/admin/', include(admin.site.urls)),
]

# Combine both for the final URL patterns
urlpatterns = public_urlpatterns + tenant_urlpatterns 