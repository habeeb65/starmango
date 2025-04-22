from django.core.management.base import BaseCommand
from django.db import transaction
from tenants.models import Tenant
from Accounts.models import Customer, PurchaseVendor, Product, PurchaseInvoice, SalesInvoice, Expense, Damages, SalesLot, Packaging_Invoice
from django_multitenant.utils import set_current_tenant

class Command(BaseCommand):
    help = 'Assigns a tenant to all existing records'
    
    def add_arguments(self, parser):
        parser.add_argument('tenant_slug', type=str, help='Slug of the tenant to assign')
    
    def handle(self, *args, **options):
        tenant_slug = options['tenant_slug']
        
        try:
            tenant = Tenant.objects.get(slug=tenant_slug)
            self.stdout.write(self.style.SUCCESS(f'Found tenant: {tenant.name}'))
        except Tenant.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Tenant with slug "{tenant_slug}" does not exist.'))
            return
        
        # Set current tenant
        set_current_tenant(tenant)
        
        # List of models to update
        models = [
            ('Customer', Customer),
            ('PurchaseVendor', PurchaseVendor),
            ('Product', Product),
            ('PurchaseInvoice', PurchaseInvoice),
            ('SalesInvoice', SalesInvoice),
            ('Expense', Expense),
            ('Damages', Damages),
            ('SalesLot', SalesLot),
            ('Packaging_Invoice', Packaging_Invoice)
        ]
        
        total_updated = 0
        with transaction.atomic():
            for model_name, model_class in models:
                self.stdout.write(f'Updating {model_name} records...')
                count = 0
                # Get all records without a tenant
                records = model_class.objects.filter(tenant__isnull=True)
                self.stdout.write(f'  Found {records.count()} records without tenant')
                
                # Bulk update records
                if records.exists():
                    for record in records:
                        record.tenant = tenant
                        record.save()
                        count += 1
                
                total_updated += count
                self.stdout.write(self.style.SUCCESS(f'  Updated {count} {model_name} records'))
        
        self.stdout.write(self.style.SUCCESS(f'Total records updated: {total_updated}')) 