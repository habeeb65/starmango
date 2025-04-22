# Starmango Multi-Tenant Documentation

## Overview

This documentation explains how to use the multi-tenant capabilities of Starmango. The system now supports multiple businesses (tenants) using the same codebase, with data isolation between tenants.

## Key Features

- **URL-based tenant isolation** - Each tenant is accessed via their unique slug in the URL path
- **Row-level data isolation** - Each record belongs to a specific tenant
- **Tenant-specific settings** - Customize features per tenant
- **Automatic tenant setup** - New tenants get default configuration based on business type
- **Tenant-aware authentication** - Users are associated with specific tenants

## How It Works

### Tenant Identification

The system identifies the current tenant in two ways:

1. **URL Path** - The first segment of the URL path is used as the tenant slug  
   Example: `https://yourdomain.com/tenant-slug/dashboard/`

2. **HTTP Header** - For API requests, you can also use the `X-Tenant` header  
   Example: `X-Tenant: tenant-slug`

### Data Isolation

All data is isolated at the row level with a `tenant` foreign key on each model. The django-multitenant package ensures that queries always filter by the current tenant.

## Usage for Developers

### Testing Tenants Locally

1. Create at least two tenants via the admin interface or registration form
2. Access each tenant's dashboard via their slug URL

### Adding Tenant Support to New Models

When creating new models, make them tenant-aware by inheriting from `TenantModel`:

```python
from tenants.models_multitenant import TenantModel

class MyNewModel(TenantModel):
    name = models.CharField(max_length=100)
    # ... other fields
    
    class Meta:
        unique_together = (('tenant', 'name'),)
```

### Querying Tenant Data

The tenant context is automatically applied to queries:

```python
# This will only return objects for the current tenant
customers = Customer.objects.all()

# If you need to explicitly set the tenant
from django_multitenant.utils import set_current_tenant
set_current_tenant(tenant)
customers = Customer.objects.all()
```

### Template Context

In templates, you can access tenant information:

```html
<h1>Welcome to {{ tenant_name }}</h1>

{% if tenant_settings.enable_credit_dashboard %}
<a href="{% url 'credit_dashboard' %}">Credit Dashboard</a>
{% endif %}
```

## Administration

### Global Admin vs. Tenant Admin

- **Global Admin** (superuser) can access all tenants' data through the Django admin interface
- **Tenant Admin** (is_tenant_admin=True) can only manage their own tenant's data

### Creating New Tenants

New tenants can be created:

1. Via the registration form at `/tenants/register/`
2. By a superuser through the Django admin interface

### Tenant Settings

Each tenant has customizable settings:

- Feature flags (enable/disable specific features)
- UI customization (colors, logo)
- Business-type specific settings

### User Management

Users are associated with a specific tenant through their UserProfile. A user can be associated with multiple tenants if needed.

## API Usage

When making API requests, include the tenant identifier:

```
# URL-based
GET https://yourdomain.com/tenant-slug/api/customers/

# Header-based
GET https://yourdomain.com/api/customers/
X-Tenant: tenant-slug
```

## Troubleshooting

### Common Issues

1. **Tenant Not Found** - Check that the tenant slug in the URL is correct
2. **Permission Denied** - Verify that the user is associated with the tenant
3. **Missing Tenant Context** - Ensure middleware is properly configured

### Debug Tools

- Check the current tenant: `request.tenant`
- Verify tenant is set in the database context: `from django_multitenant.utils import get_current_tenant`

## Limitations

- The system currently uses row-level tenant isolation, not schema-based
- Some Django features may require special handling in a multi-tenant context
- Admin interface modifications may be needed for complex use cases 