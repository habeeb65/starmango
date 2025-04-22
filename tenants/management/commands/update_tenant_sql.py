from django.core.management.base import BaseCommand
from django.db import transaction, connections
from tenants.models import Tenant

class Command(BaseCommand):
    help = 'Assigns a tenant to all existing records using raw SQL'
    
    def add_arguments(self, parser):
        parser.add_argument('tenant_slug', type=str, help='Slug of the tenant to assign')
    
    def handle(self, *args, **options):
        tenant_slug = options['tenant_slug']
        
        try:
            tenant = Tenant.objects.get(slug=tenant_slug)
            self.stdout.write(self.style.SUCCESS(f'Found tenant: {tenant.name} (ID: {tenant.id})'))
        except Tenant.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'Tenant with slug "{tenant_slug}" does not exist.'))
            return
        
        # Tables to update
        tables = [
            'Accounts_customer',
            'Accounts_purchasevendor',
            'Accounts_product',
            'Accounts_purchaseinvoice',
            'Accounts_salesinvoice',
            'Accounts_expense',
            'Accounts_damages',
            'Accounts_saleslot',
            'Accounts_packaging_invoice'
        ]
        
        with transaction.atomic():
            cursor = connections['default'].cursor()
            total_updated = 0
            
            for table in tables:
                self.stdout.write(f'Updating {table}...')
                
                # Check if the table exists
                cursor.execute(f"SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='{table}'")
                if cursor.fetchone()[0] == 0:
                    self.stdout.write(self.style.WARNING(f'  Table {table} does not exist. Skipping.'))
                    continue
                
                # Count records with null tenant
                cursor.execute(f"SELECT COUNT(*) FROM {table} WHERE tenant_id IS NULL")
                count = cursor.fetchone()[0]
                self.stdout.write(f'  Found {count} records without tenant')
                
                # Update records
                if count > 0:
                    cursor.execute(f"UPDATE {table} SET tenant_id = {tenant.id} WHERE tenant_id IS NULL")
                    total_updated += count
                    self.stdout.write(self.style.SUCCESS(f'  Updated {count} records'))
            
            cursor.close()
            
        self.stdout.write(self.style.SUCCESS(f'Total records updated: {total_updated}')) 