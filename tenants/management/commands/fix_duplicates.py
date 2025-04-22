from django.core.management.base import BaseCommand, CommandError
from django.db import connection
from tenants.models import Tenant

class Command(BaseCommand):
    help = "Identifies and fixes duplicate records after tenant migration"

    def add_arguments(self, parser):
        parser.add_argument('tenant_slug', nargs='?', type=str, help='Slug of the tenant to check for duplicates')
        parser.add_argument('--fix', action='store_true', help='Fix duplicates by renaming them')
    
    def handle(self, *args, **options):
        tenant_slug = options.get('tenant_slug')
        fix = options.get('fix', False)
        
        if tenant_slug:
            try:
                tenant = Tenant.objects.get(slug=tenant_slug)
                self.stdout.write(f"Checking for duplicates in tenant '{tenant.name}'")
                self._check_vendors(tenant, fix)
                self._check_customers(tenant, fix)
                self._check_products(tenant, fix)
            except Tenant.DoesNotExist:
                raise CommandError(f"Tenant with slug '{tenant_slug}' does not exist")
        else:
            self.stdout.write("Checking for duplicates across all tenants")
            for tenant in Tenant.objects.all():
                self.stdout.write(f"\nTenant: {tenant.name}")
                self._check_vendors(tenant, fix)
                self._check_customers(tenant, fix)
                self._check_products(tenant, fix)
    
    def _check_vendors(self, tenant, fix):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT name, COUNT(*) as count 
                FROM accounts_purchasevendor 
                WHERE tenant_id = %s
                GROUP BY name 
                HAVING COUNT(*) > 1
            """, [tenant.id])
            
            duplicates = cursor.fetchall()
            
            if duplicates:
                self.stdout.write(f"Found {len(duplicates)} duplicate vendors")
                
                for name, count in duplicates:
                    self.stdout.write(f"  - '{name}' appears {count} times")
                    
                    if fix:
                        cursor.execute("""
                            SELECT id, name FROM accounts_purchasevendor
                            WHERE tenant_id = %s AND name = %s
                            ORDER BY id
                        """, [tenant.id, name])
                        
                        vendors = cursor.fetchall()
                        # Keep the first one as is, rename the others
                        for i, (vendor_id, vendor_name) in enumerate(vendors[1:], 1):
                            new_name = f"{name} (Duplicate {i})"
                            cursor.execute("""
                                UPDATE accounts_purchasevendor
                                SET name = %s
                                WHERE id = %s
                            """, [new_name, vendor_id])
                            self.stdout.write(f"    Renamed vendor #{vendor_id} to '{new_name}'")
            else:
                self.stdout.write("No duplicate vendors found")
    
    def _check_customers(self, tenant, fix):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT name, COUNT(*) as count 
                FROM accounts_customer 
                WHERE tenant_id = %s
                GROUP BY name 
                HAVING COUNT(*) > 1
            """, [tenant.id])
            
            duplicates = cursor.fetchall()
            
            if duplicates:
                self.stdout.write(f"Found {len(duplicates)} duplicate customers")
                
                for name, count in duplicates:
                    self.stdout.write(f"  - '{name}' appears {count} times")
                    
                    if fix:
                        cursor.execute("""
                            SELECT id, name FROM accounts_customer
                            WHERE tenant_id = %s AND name = %s
                            ORDER BY id
                        """, [tenant.id, name])
                        
                        customers = cursor.fetchall()
                        # Keep the first one as is, rename the others
                        for i, (customer_id, customer_name) in enumerate(customers[1:], 1):
                            new_name = f"{name} (Duplicate {i})"
                            cursor.execute("""
                                UPDATE accounts_customer
                                SET name = %s
                                WHERE id = %s
                            """, [new_name, customer_id])
                            self.stdout.write(f"    Renamed customer #{customer_id} to '{new_name}'")
            else:
                self.stdout.write("No duplicate customers found")
    
    def _check_products(self, tenant, fix):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT name, COUNT(*) as count 
                FROM accounts_product 
                WHERE tenant_id = %s
                GROUP BY name 
                HAVING COUNT(*) > 1
            """, [tenant.id])
            
            duplicates = cursor.fetchall()
            
            if duplicates:
                self.stdout.write(f"Found {len(duplicates)} duplicate products")
                
                for name, count in duplicates:
                    self.stdout.write(f"  - '{name}' appears {count} times")
                    
                    if fix:
                        cursor.execute("""
                            SELECT id, name FROM accounts_product
                            WHERE tenant_id = %s AND name = %s
                            ORDER BY id
                        """, [tenant.id, name])
                        
                        products = cursor.fetchall()
                        # Keep the first one as is, rename the others
                        for i, (product_id, product_name) in enumerate(products[1:], 1):
                            new_name = f"{name} (Duplicate {i})"
                            cursor.execute("""
                                UPDATE accounts_product
                                SET name = %s
                                WHERE id = %s
                            """, [new_name, product_id])
                            self.stdout.write(f"    Renamed product #{product_id} to '{new_name}'")
            else:
                self.stdout.write("No duplicate products found") 