# Starmango Architecture and Development Guidelines

This document provides essential guidelines for AI-assisted development within the Starmango project. Following these patterns will ensure consistent architecture and maintainability.

## Multi-Tenant Architecture Rules

Starmango implements a custom multi-tenant architecture with the following key principles:

1. **Tenant Isolation**
   - Every tenant's data must be isolated completely from other tenants
   - All business models MUST include a foreign key to the Tenant model
   - All queries MUST be filtered by tenant (usually handled by TenantManager)
   - Direct SQL queries should be avoided when possible, but if necessary, must include tenant filtering

2. **Tenant Context**
   - The current tenant is set via middleware based on URL slug or request header
   - Use `django_multitenant.utils.set_current_tenant()` and `get_current_tenant()` when needed
   - Never assume a global context - always consider tenant isolation

3. **User Association**
   - Users are always linked to a specific tenant via UserProfile
   - There are no "global users" - each user belongs to exactly one tenant
   - Tenant admins have full control only over their own tenant's data
   - User authentication flows must respect tenant boundaries

## Model Usage Patterns

### Creating New Models

All business models should:

```python
# Import necessary components
from django_multitenant.mixins import TenantModelMixin
from django_multitenant.models import TenantManagerMixin
from tenants.models import Tenant

# Create tenant manager
class TenantManager(TenantManagerMixin, models.Manager):
    pass

# New tenant-aware model
class YourModel(TenantModelMixin, models.Model):
    # Required tenant field
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'  # Required for django-multitenant
    
    # Model fields
    name = models.CharField(max_length=100)
    # ... other fields
    
    # Use tenant manager to ensure queries are filtered by tenant
    objects = TenantManager()
    
    class Meta:
        # Ensure uniqueness per tenant
        unique_together = (('tenant', 'name'),)
```

### Querying Models

Always use the model's manager for querying:

```python
# CORRECT: Uses tenant manager which filters by current tenant
products = Product.objects.all()

# WRONG: Bypasses tenant filtering
products = Product.objects.using('default').all()  # Don't do this!
```

### Transactions

When using transactions, ensure tenant context is maintained:

```python
from django.db import transaction
from django_multitenant.utils import set_current_tenant

# Set tenant context at the beginning of the transaction
tenant = request.tenant
set_current_tenant(tenant)

with transaction.atomic():
    # All operations here will maintain tenant context
    product = Product.objects.create(name="New Product")  # tenant is automatically set
```

## Authentication Flow Logic

Starmango uses a tenant-specific authentication flow:

1. Each tenant has an admin user (superuser within tenant context)
2. Regular users can only access their assigned tenant
3. There is no global user directory - each tenant manages their own users

When implementing authentication features:

- Always check user's tenant against current tenant context
- Use `request.user.profile.tenant` to get user's tenant
- Navigation should be tenant-aware, with URLs containing tenant slug
- Login should redirect to the user's tenant dashboard

```python
# Typical view with tenant-aware auth
from django.contrib.auth.decorators import login_required

@login_required
def some_view(request, tenant_slug):
    # Verify user belongs to this tenant
    if request.user.profile.tenant.slug != tenant_slug:
        return HttpResponseForbidden("Access denied")
    
    # Proceed with view logic
    # ...
```

## What NOT to Do

### ❌ DON'T use django-tenants package

Starmango uses a custom tenant implementation based on django-multitenant, not django-tenants. Don't introduce code patterns from the django-tenants package.

### ❌ DON'T assume global user directory

There are no users without a tenant. Never write code that assumes users exist independently of tenants.

### ❌ DON'T skip tenant filtering

Always ensure database queries are filtered by tenant, even in admin views or management commands.

### ❌ DON'T create models without tenant field

All business models must have a tenant foreign key and use TenantManager.

### ❌ DON'T use direct database connections

Avoid raw SQL or direct database connections that might bypass tenant isolation.

## Preferred Patterns

### ✅ Custom Managers

Use custom managers to encapsulate complex query logic while maintaining tenant isolation:

```python
class CustomerManager(TenantManager):
    def with_outstanding_balance(self):
        return self.annotate(
            total_due=Sum('sales_invoices__payments__amount') - Sum('sales_invoices__total')
        ).filter(total_due__gt=0)

class Customer(TenantModelMixin, models.Model):
    # ... fields
    objects = CustomerManager()
```

### ✅ Tenant-aware Forms

Make forms tenant-aware by filtering querysets:

```python
class SalesInvoiceForm(forms.ModelForm):
    class Meta:
        model = SalesInvoice
        fields = ['vendor', 'invoice_date', 'vehicle_number']
    
    def __init__(self, *args, **kwargs):
        self.tenant = kwargs.pop('tenant')
        super().__init__(*args, **kwargs)
        # Filter choices by tenant
        self.fields['vendor'].queryset = Customer.objects.filter(tenant=self.tenant)
```

### ✅ Use Request Context

Pass the tenant from request to functions that need it:

```python
def dashboard_view(request, tenant_slug):
    tenant = request.tenant
    # Pass tenant to helper functions
    sales_data = get_sales_data(tenant)
    return render(request, 'dashboard.html', {'sales_data': sales_data})
```

## Data Migration Considerations

When writing migrations:

- Always consider tenant boundaries
- Test migrations with multiple tenants to ensure isolation
- Use `for_each_tenant()` pattern for tenant-specific data migrations

```python
def migrate_tenant_data(apps, tenant):
    # Get the historical models
    Product = apps.get_model('Accounts', 'Product')
    
    # Set tenant context
    set_current_tenant(tenant)
    
    # Perform tenant-specific migration
    # ...

def for_each_tenant(apps, schema_editor):
    Tenant = apps.get_model('tenants', 'Tenant')
    for tenant in Tenant.objects.all():
        migrate_tenant_data(apps, tenant)

class Migration(migrations.Migration):
    # ...
    operations = [
        migrations.RunPython(for_each_tenant),
    ]
```

## API Development Guidelines

When developing API endpoints:

- Include tenant context in all API responses
- Use tenant-aware serializers
- Validate tenant access in all viewsets
- Consider using custom permission classes for tenant validation

```python
class TenantAccessPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if user has access to the requested tenant
        requested_tenant = view.kwargs.get('tenant_slug')
        return request.user.profile.tenant.slug == requested_tenant

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, TenantAccessPermission]
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        # Already filtered by tenant through TenantManager
        return Product.objects.all()
```

By following these guidelines, AI-assisted development will maintain the integrity of Starmango's multi-tenant architecture and ensure consistent, maintainable code.
