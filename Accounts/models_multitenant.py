"""
This file contains model mixins and utilities for adding multi-tenant support to existing models.
After installing django-multitenant, these changes will need to be applied to your models.
"""

from django.db import models
from django_multitenant.mixins import TenantManagerMixin, TenantModelMixin
from tenants.models import Tenant

class TenantManager(TenantManagerMixin, models.Manager):
    """Tenant-aware model manager"""
    pass

# Define model mixin for all tenant models
class TenantModel(TenantModelMixin, models.Model):
    """Base model for all tenant-specific models"""
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    
    # Set the tenant field name
    tenant_id = 'tenant_id'
    
    # Use the tenant manager
    objects = TenantManager()
    
    class Meta:
        abstract = True

# ----------------
# Example of how to modify the Customer model
# ----------------
"""
class Customer(TenantModel):
    # Your existing fields remain unchanged
    name = models.CharField(max_length=200)
    # ... other fields
    
    class Meta:
        unique_together = (('tenant', 'name'),)  # Ensure name is unique per tenant
"""

# ----------------
# Migration instructions for existing models
# ----------------
"""
For each existing model, you should:
1. Add the tenant field:
   tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)

2. Set the tenant_id field name:
   tenant_id = 'tenant_id'

3. Override the manager:
   objects = TenantManager()
   
4. Update Meta to include unique_together with tenant, e.g:
   class Meta:
       unique_together = (('tenant', 'name'),)
       
5. Have the class inherit from TenantModelMixin:
   class YourModel(TenantModelMixin, models.Model):
""" 