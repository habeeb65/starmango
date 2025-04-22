from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from tenants.models import Tenant, UserProfile, TenantSettings
from django.db import transaction

class Command(BaseCommand):
    help = 'Creates a default tenant and associates all users with it'
    
    def add_arguments(self, parser):
        parser.add_argument('--name', type=str, default='Star Mango Supplies', 
                           help='Name for default tenant')
        parser.add_argument('--slug', type=str, default='starmango',
                           help='URL slug for the tenant')
        parser.add_argument('--type', type=str, choices=['mango', 'vegetable', 'fruit'], 
                           default='mango', help='Business type')
        parser.add_argument('--force', action='store_true', 
                           help='Force creation even if tenant exists')
    
    def handle(self, *args, **options):
        tenant_name = options['name']
        tenant_slug = options['slug']
        business_type = options['type']
        force = options['force']
        
        # Check if tenant with this slug already exists
        if Tenant.objects.filter(slug=tenant_slug).exists():
            if force:
                self.stdout.write(self.style.WARNING(f'Tenant with slug "{tenant_slug}" already exists, but --force is set.'))
                tenant = Tenant.objects.get(slug=tenant_slug)
            else:
                self.stdout.write(self.style.SUCCESS(f'Tenant with slug "{tenant_slug}" already exists. Use --force to override.'))
                tenant = Tenant.objects.get(slug=tenant_slug)
                self.associate_users(tenant)
                return
        else:
            # Create the tenant
            self.stdout.write(self.style.MIGRATE_HEADING(f'Creating default tenant "{tenant_name}" with slug "{tenant_slug}"...'))
            
            tenant = Tenant.objects.create(
                name=tenant_name,
                slug=tenant_slug,
                business_type=business_type
            )
            
            # Create tenant settings if they don't exist
            if not hasattr(tenant, 'settings'):
                try:
                    TenantSettings.objects.create(tenant=tenant)
                    self.stdout.write('Created tenant settings')
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f'Could not create tenant settings: {str(e)}'))
            
            self.stdout.write(self.style.SUCCESS(f'Successfully created default tenant "{tenant_name}"'))
        
        # Associate all users with this tenant
        self.associate_users(tenant)
    
    def associate_users(self, tenant):
        """Associate existing users with the tenant"""
        self.stdout.write('Associating users with tenant...')
        
        users_count = 0
        with transaction.atomic():
            for user in User.objects.all():
                # Skip if user already has a profile
                if hasattr(user, 'profile'):
                    continue
                    
                UserProfile.objects.create(
                    user=user,
                    tenant=tenant,
                    is_tenant_admin=user.is_staff or user.is_superuser
                )
                users_count += 1
                
        self.stdout.write(self.style.SUCCESS(f'Associated {users_count} users with tenant')) 