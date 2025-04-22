# Multi-tenant Implementation for StarMango

This document provides an overview of the multi-tenant implementation for the StarMango application.

## Overview

The multi-tenant architecture allows multiple "tenants" (businesses) to share a single instance of the application while keeping their data separate. Each tenant has its own set of users, customers, vendors, products, and other data.

## Key Components

- **Tenant Model**: Stores information about each tenant (business)
- **UserProfile Model**: Associates users with a specific tenant
- **TenantMiddleware**: Identifies the current tenant based on the URL
- **TenantAwareBackend**: Ensures authentication is scoped to the current tenant

## Features

- **URL-based tenant identification**: Tenants are identified by a slug in the URL (e.g., `example.com/starmango/`)
- **Tenant isolation**: Each tenant's data is isolated from other tenants
- **Shared codebase**: All tenants use the same application code
- **Custom settings per tenant**: Each tenant can have its own settings

## Implementation Steps

1. **Initial Setup**:
   - Create the `tenants` app
   - Define `Tenant`, `UserProfile`, and `TenantSettings` models
   - Create initial migration for the tenants app
   - Add multi-tenant middleware to the settings

2. **Data Migration**:
   - Create a default tenant
   - Associate existing users with the default tenant

3. **Model Updates**:
   - Update models to be tenant-aware by adding a `tenant` field
   - Add tenant-specific managers
   - Update unique constraints to include tenant

4. **Scripts and Utilities**:
   - `initialize_default_tenant.py`: Creates the default tenant and associates users
   - `migrate_to_tenant.py`: Migrates existing data to a tenant
   - `create_tenant.py`: Creates a new tenant with admin user
   - `tenant_shell.py`: Opens a Django shell with a tenant context
   - `update_tenant_models.ps1`: PowerShell script to guide through the migration process

## How to Use

### Creating a Default Tenant

```powershell
python manage.py initialize_default_tenant
```

### Creating a New Tenant

```powershell
python manage.py create_tenant "Business Name" --slug=business-slug --type=mango
```

### Migrating Data to a Tenant

```powershell
python manage.py migrate_to_tenant business-slug
```

### Testing with Tenant Context

```powershell
python manage.py tenant_shell business-slug
```

### Using the Migration Script

```powershell
.\update_tenant_models.ps1
```

## Further Development

To further extend the multi-tenant functionality, consider:

1. Adding tenant-specific themes and branding
2. Implementing tenant-specific URL routing
3. Adding tenant user management in the admin interface
4. Developing a tenant registration and onboarding process

## References

- [Django Multi-tenant Documentation](https://github.com/citusdata/django-multitenant)
- `MULTITENANT_MIGRATION.md` - Detailed migration plan
- `TENANT_MODEL_EXAMPLE.md` - Examples of tenant-aware models 