# Multi-Tenant Migration Plan for Starmango

This document outlines the step-by-step process to convert your existing Starmango application to a multi-tenant SaaS platform using django-multitenant.

## 1. Database Backup

Before starting the migration, create a complete backup of your database:

```bash
# For PostgreSQL
pg_dump starmango > starmango_backup.sql
```

## 2. Install Required Packages

```bash
pip install django-multitenant
pip install pip-tools  # For managing dependencies
```

## 3. Initial Setup

1. Make sure the `tenants` app is created with all the files we've added
2. Add the tenants app to your INSTALLED_APPS in settings.py
3. Add the TenantMiddleware to your middleware stack

## 4. Create Initial Migration for Tenants App

```bash
python manage.py makemigrations tenants
python manage.py migrate tenants
```

## 5. Create Default Tenant

Create a default tenant for your existing data:

```python
# Create a management command or run this in a shell
from tenants.models import Tenant, TenantSettings

# Create the default tenant
tenant = Tenant.objects.create(
    name="Star Mango Supplies",
    slug="starmango",
    business_type="mango"
)

# Create settings for the tenant
TenantSettings.objects.create(tenant=tenant)

print(f"Created default tenant: {tenant.name} with ID {tenant.id}")
```

## 6. Add Tenant Field to Existing Models

For each model that needs to be tenant-aware, apply these changes:

1. Add the tenant field
2. Add TenantModelMixin as a parent class
3. Add the tenant manager
4. Update unique constraints

Example:

```python
from django_multitenant.mixins import TenantModelMixin
from tenants.models import Tenant

class TenantManager(TenantManagerMixin, models.Manager):
    pass

class Customer(TenantModelMixin, models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    
    # Existing fields
    name = models.CharField(max_length=100)
    # ...
    
    objects = TenantManager()
    
    class Meta:
        unique_together = (('tenant', 'name'),)
```

## 7. Create Schema Migrations

Create migrations for your modified models:

```bash
python manage.py makemigrations Accounts
```

## 8. Data Migration - Associate Existing Records with Default Tenant

When migrating existing data to a multi-tenant system, you may encounter issues with duplicate records and integrity constraints. Here's a strategy that worked well:

### Step 1: Temporarily set tenant field to nullable

Before associating records with tenants, modify your models to allow the tenant field to be null:

```python
class Customer(TenantModelMixin, models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, null=True)
    tenant_id = 'tenant_id'
    # ...
```

Create and apply migrations for these changes:

```bash
python manage.py makemigrations Accounts
python manage.py migrate Accounts
```

### Step 2: Associate records with tenant using raw SQL

Create a management command to safely update the tenant ID for all records:

```bash
python manage.py update_tenant_sql starmango
```

This command uses raw SQL to update the tenant field for each model, which is faster and avoids ORM validation issues.

### Step 3: Deal with duplicate records

After assigning tenants, you'll likely have duplicates that violate the unique constraints. Create a command to detect and fix these:

```bash
# First check for duplicates
python manage.py fix_duplicates starmango

# Then fix them by appending "(Duplicate X)" to the name
python manage.py fix_duplicates starmango --fix
```

### Step 4: Make tenant field required again

Once duplicates are fixed, create migrations to make the tenant field required again:

```bash
python manage.py makemigrations Accounts --empty --name require_tenant_field
```

Edit the migration to change null=True to null=False:

```python
# In your migration file
operations = [
    migrations.AlterField(
        model_name='customer',
        name='tenant',
        field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tenants.tenant'),
    ),
    # Repeat for other models
]
```

Apply the migration:

```bash
python manage.py migrate Accounts
```

### Step 5: Update model definitions

Update your model definitions to match the database schema:

```python
class Customer(TenantModelMixin, models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    tenant_id = 'tenant_id'
    # ...
```

Create a migration to re-add unique constraints:

```bash
python manage.py makemigrations Accounts
python manage.py migrate Accounts
```

## 9. Apply Migrations

```bash
python manage.py migrate
```

## 10. Create User Profiles for Existing Users

Create a data migration to associate existing users with the default tenant:

```bash
python manage.py makemigrations tenants --empty --name create_user_profiles
```

Edit the migration file:

```python
from django.db import migrations

def create_user_profiles(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    UserProfile = apps.get_model('tenants', 'UserProfile')
    Tenant = apps.get_model('tenants', 'Tenant')
    
    default_tenant = Tenant.objects.get(slug='starmango')
    
    for user in User.objects.all():
        # Skip if the user already has a profile
        if not UserProfile.objects.filter(user=user).exists():
            UserProfile.objects.create(
                user=user,
                tenant=default_tenant,
                is_tenant_admin=user.is_staff or user.is_superuser
            )

def reverse_migration(apps, schema_editor):
    # No reverse migration needed
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('tenants', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),  # Adjust if needed
    ]

    operations = [
        migrations.RunPython(create_user_profiles, reverse_migration),
    ]
```

## 11. Update URL Configuration

Update your main urls.py to use the tenant routing configuration.

## 12. Create Templates

Make sure all templates for tenant management are in place.

## 13. Testing

Test the migration thoroughly in a development environment before applying to production:

1. Verify tenant isolation is working
2. Check that existing users can access their data
3. Test tenant registration and user creation
4. Test admin interface

## 14. Deploy

After thorough testing, deploy the changes to production:

1. Backup the production database
2. Apply migrations
3. Update the application code
4. Restart the application

## 15. Post-Migration Tasks

1. Create a superuser for the multi-tenant system
2. Set up monitoring for tenant-specific errors
3. Test the system with multiple tenants
4. Document the tenant management procedures 