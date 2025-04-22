from django.core.management.base import BaseCommand
from django.db import connection
from django_multitenant.utils import set_current_tenant
from tenants.models import Tenant
import os

class Command(BaseCommand):
    help = 'Starts a Django shell with a tenant context set'
    
    def add_arguments(self, parser):
        parser.add_argument('tenant_slug', type=str, help='Slug of tenant to use as context')
    
    def handle(self, *args, **options):
        tenant_slug = options['tenant_slug']
        
        try:
            tenant = Tenant.objects.get(slug=tenant_slug)
        except Tenant.DoesNotExist:
            self.stderr.write(self.style.ERROR(f'Tenant with slug "{tenant_slug}" does not exist.'))
            return
        
        self.stdout.write(self.style.SUCCESS(f'Setting tenant context to: {tenant.name}'))
        
        # Create a Python script that sets up the tenant context
        script_content = f"""
from django_multitenant.utils import set_current_tenant
from tenants.models import Tenant

# Set up tenant context
tenant = Tenant.objects.get(slug='{tenant_slug}')
set_current_tenant(tenant)

print(f'\\nTenant context: {{tenant.name}} ({{tenant.slug}})')
print('You can now query tenant-specific models like:')
print('Customer.objects.all()')
print('\\n')
"""
        
        # Write the script to a temporary file
        script_path = 'tenant_shell_setup.py'
        with open(script_path, 'w') as f:
            f.write(script_content)
        
        # Start the shell with the script
        shell_command = f'python manage.py shell -i -c "exec(open(\'{script_path}\').read())"'
        os.system(shell_command)
        
        # Clean up
        os.remove(script_path) 