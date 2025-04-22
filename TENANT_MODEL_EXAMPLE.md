# Multi-tenant Model Conversion Examples

This document provides examples of how to convert your existing Django models to be tenant-aware.

## Before: Original Customer Model

```python
class Customer(models.Model):
    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return self.name
        
    # Other methods...
```

## After: Tenant-aware Customer Model

```python
from django_multitenant.mixins import TenantModelMixin
from django_multitenant.models import TenantManagerMixin
from tenants.models import Tenant

class TenantManager(TenantManagerMixin, models.Manager):
    pass

class Customer(TenantModelMixin, models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    
    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    objects = TenantManager()
    
    class Meta:
        unique_together = (('tenant', 'name'),)
    
    def __str__(self):
        return self.name
        
    # Other methods remain unchanged...
```

## Changes Required for All Models

1. Import the necessary classes:
   ```python
   from django_multitenant.mixins import TenantModelMixin
   from django_multitenant.models import TenantManagerMixin
   from tenants.models import Tenant
   ```

2. Create a tenant manager:
   ```python
   class TenantManager(TenantManagerMixin, models.Manager):
       pass
   ```

3. Add TenantModelMixin to the model's inheritance:
   ```python
   class YourModel(TenantModelMixin, models.Model):
   ```

4. Add the tenant field:
   ```python
   tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
   tenant_id = 'tenant_id'  # Required for django-multitenant
   ```

5. Add the tenant manager:
   ```python
   objects = TenantManager()
   ```

6. Update unique constraints to include tenant:
   ```python
   class Meta:
       unique_together = (('tenant', 'name'),)
   ```

## Handling Migration

After updating your models, run the migration commands:

```bash
python manage.py makemigrations Accounts
python manage.py migrate
```

Then associate existing records with the default tenant:

```bash
python manage.py migrate_to_tenant starmango
```

## Usage in Views

In views, you need to set the current tenant:

```python
from django_multitenant.utils import set_current_tenant
from tenants.models import Tenant

def your_view(request):
    # Get tenant from request (handled by middleware)
    tenant = request.tenant
    
    # Set current tenant for ORM operations
    set_current_tenant(tenant)
    
    # Now queries will be scoped to the current tenant
    customers = Customer.objects.all()  # Only returns customers for the current tenant
    
    # ...rest of your view
``` 