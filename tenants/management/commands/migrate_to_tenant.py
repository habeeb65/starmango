from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.contrib.auth.models import User
from django_multitenant.utils import set_current_tenant
from tenants.models import Tenant, UserProfile, TenantSettings

class Command(BaseCommand):
    help = 'Migrates existing data to the tenant system'
    
    def add_arguments(self, parser):
        parser.add_argument('tenant_slug', type=str, help='Slug of tenant to migrate data to')
        parser.add_argument('--create', action='store_true', help='Create tenant if it does not exist')
        parser.add_argument('--name', type=str, help='Name for new tenant (if --create)')
        parser.add_argument('--type', type=str, choices=['mango', 'vegetable', 'fruit'], 
                           default='mango', help='Business type (if --create)')
    
    def handle(self, *args, **options):
        tenant_slug = options['tenant_slug']
        
        # Get or create tenant
        try:
            tenant = Tenant.objects.get(slug=tenant_slug)
            self.stdout.write(self.style.SUCCESS(f'Found existing tenant: "{tenant.name}"'))
        except Tenant.DoesNotExist:
            if options['create']:
                tenant_name = options['name'] or tenant_slug.replace('-', ' ').title()
                tenant = Tenant.objects.create(
                    name=tenant_name,
                    slug=tenant_slug,
                    business_type=options['type']
                )
                TenantSettings.objects.create(tenant=tenant)
                self.stdout.write(self.style.SUCCESS(f'Created new tenant: "{tenant.name}"'))
            else:
                raise CommandError(f'Tenant with slug "{tenant_slug}" does not exist. Use --create to create it.')
        
        # Set current tenant for all operations
        set_current_tenant(tenant)
        
        # Associate existing users with tenant
        self.associate_users(tenant)
        
        # Migrate model data
        self.migrate_data(tenant)
        
        self.stdout.write(self.style.SUCCESS('Migration completed successfully!'))
    
    def associate_users(self, tenant):
        """Associate existing users with the tenant"""
        self.stdout.write('Associating users with tenant...')
        
        users_count = 0
        for user in User.objects.all():
            if not hasattr(user, 'profile'):
                UserProfile.objects.create(
                    user=user,
                    tenant=tenant,
                    is_tenant_admin=user.is_staff or user.is_superuser
                )
                users_count += 1
                
        self.stdout.write(self.style.SUCCESS(f'Associated {users_count} users with tenant'))
    
    def migrate_data(self, tenant):
        """Migrate existing model data to the tenant"""
        self.stdout.write('Migrating existing data to tenant...')
        
        # Use a transaction to ensure all-or-nothing migration
        with transaction.atomic():
            # List of models to migrate
            from Accounts.models import (Customer, PurchaseVendor, Product, PurchaseInvoice, 
                                       PurchaseProduct, Payment, SalesInvoice, SalesProduct,
                                       SalesPayment, Expense, Damages, SalesLot, Packaging_Invoice)
            
            models_to_migrate = [
                ('Customer', Customer),
                ('Vendor', PurchaseVendor),
                ('Product', Product),
                ('PurchaseInvoice', PurchaseInvoice),
                ('PurchaseProduct', PurchaseProduct),
                ('Payment', Payment),
                ('SalesInvoice', SalesInvoice),
                ('SalesProduct', SalesProduct),
                ('SalesPayment', SalesPayment),
                ('Expense', Expense),
                ('Damages', Damages),
                ('SalesLot', SalesLot),
                ('Packaging_Invoice', Packaging_Invoice),
            ]
            
            # Track stats
            stats = {}
            
            # Migrate each model
            for model_name, model_class in models_to_migrate:
                try:
                    # Only process objects that don't already have a tenant
                    if hasattr(model_class, 'tenant'):
                        objects = model_class.objects.filter(tenant__isnull=True)
                        count = objects.count()
                        
                        if count > 0:
                            self.stdout.write(f'  Migrating {count} {model_name} objects...')
                            
                            # Bulk update tenant field
                            for obj in objects:
                                obj.tenant = tenant
                                obj.save()
                                
                        stats[model_name] = count
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error migrating {model_name}: {str(e)}'))
            
            # Print stats
            self.stdout.write('Migration summary:')
            for model_name, count in stats.items():
                self.stdout.write(f'  {model_name}: {count} objects')
                
            total = sum(stats.values())
            self.stdout.write(self.style.SUCCESS(f'Total migrated objects: {total}')) 