"""
This file contains settings that should be added to your project's settings.py
to enable multi-tenant support.
"""

# Add to INSTALLED_APPS
INSTALLED_APPS += [
    'django_multitenant',  # Add the multitenant library
    'tenants',             # Add our tenants app
]

# Add the tenant middleware
MIDDLEWARE = [
    # Insert the tenant middleware as early as possible
    'tenants.middleware.TenantMiddleware',
] + MIDDLEWARE

# Add tenant-aware authentication backend
AUTHENTICATION_BACKENDS = [
    'tenants.backends.TenantAwareBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# Define URL prefixes that should not be processed by the tenant middleware
# The TenantMiddleware will ignore these paths when looking for tenant slugs
TENANT_EXEMPT_URLS = [
    'admin',
    'static',
    'media',
    'accounts',
    'api',
    '',  # Root URL
]

# Public tenant for shared resources (optional)
# DEFAULT_TENANT_SLUG = 'public' 