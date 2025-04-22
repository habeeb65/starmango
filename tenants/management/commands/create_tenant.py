from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from django.utils.text import slugify
from django_multitenant.utils import set_current_tenant
from tenants.models import Tenant, UserProfile, TenantSettings
from Accounts.models import Product, Customer, PurchaseVendor
import getpass

class Command(BaseCommand):
    help = 'Creates a new tenant with admin user and default data'
    
    def add_arguments(self, parser):
        parser.add_argument('name', type=str, help='Name of the business/tenant')
        parser.add_argument('--slug', type=str, help='URL slug for the tenant (optional, will be generated from name)')
        parser.add_argument('--type', type=str, choices=['mango', 'vegetable', 'fruit'], 
                           default='mango', help='Business type')
        parser.add_argument('--admin-username', type=str, help='Admin username (optional)')
        parser.add_argument('--admin-email', type=str, help='Admin email (optional)')
        
    def handle(self, *args, **options):
        # Get the tenant name and create a slug if not provided
        tenant_name = options['name']
        tenant_slug = options['slug'] or slugify(tenant_name)
        business_type = options['type']
        
        # Check if tenant with this slug already exists
        if Tenant.objects.filter(slug=tenant_slug).exists():
            raise CommandError(f'Tenant with slug "{tenant_slug}" already exists.')
            
        # Create the tenant
        self.stdout.write(self.style.MIGRATE_HEADING(f'Creating tenant "{tenant_name}" with slug "{tenant_slug}"...'))
        
        tenant = Tenant.objects.create(
            name=tenant_name,
            slug=tenant_slug,
            business_type=business_type
        )
        
        # Create tenant settings
        TenantSettings.objects.create(tenant=tenant)
        
        # Create admin user if needed
        admin_username = options['admin_username']
        admin_email = options['admin_email']
        
        if not admin_username:
            admin_username = input('Admin username: ')
        
        if not admin_email:
            admin_email = input('Admin email: ')
            
        # Check if user exists
        user = None
        if User.objects.filter(username=admin_username).exists():
            self.stdout.write(self.style.WARNING(f'User "{admin_username}" already exists.'))
            use_existing = input('Use existing user? (y/n): ').lower() == 'y'
            
            if use_existing:
                user = User.objects.get(username=admin_username)
            else:
                admin_username = input('New admin username: ')
        
        if not user:
            # Create new user
            password = getpass.getpass('Admin password: ')
            confirm_password = getpass.getpass('Confirm password: ')
            
            if password != confirm_password:
                raise CommandError('Passwords do not match.')
                
            user = User.objects.create_user(
                username=admin_username,
                email=admin_email,
                password=password,
                is_staff=True
            )
            
            self.stdout.write(self.style.SUCCESS(f'Created admin user "{admin_username}"'))
        
        # Create user profile for the tenant
        UserProfile.objects.create(
            user=user,
            tenant=tenant,
            is_tenant_admin=True
        )
        
        # Create default data
        set_current_tenant(tenant)
        self._create_default_data(tenant)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created tenant "{tenant_name}" with slug "{tenant_slug}"'))
        self.stdout.write(f'Access URL: /"{tenant_slug}/"')
        
    def _create_default_data(self, tenant):
        """Create default data for the tenant based on business type"""
        self.stdout.write('Creating default data...')
        
        # Create default products based on business type
        if tenant.business_type == 'mango':
            products = ['Alphonso', 'Banganapalli', 'Totapuri', 'Kesar']
        elif tenant.business_type == 'vegetable':
            products = ['Tomato', 'Potato', 'Onion', 'Carrot']
        else:  # fruit
            products = ['Apple', 'Banana', 'Orange', 'Grapes']
        
        for product_name in products:
            Product.objects.create(
                tenant=tenant,
                name=product_name
            )
            self.stdout.write(f'  - Created product: {product_name}')
        
        # Create default customer
        Customer.objects.create(
            tenant=tenant,
            name="Sample Customer",
            contact_number="1234567890",
            address="Sample Address"
        )
        self.stdout.write('  - Created sample customer')
        
        # Create default vendor
        PurchaseVendor.objects.create(
            tenant=tenant,
            name="Sample Vendor",
            contact_number="9876543210",
            area="Sample Area"
        )
        self.stdout.write('  - Created sample vendor') 