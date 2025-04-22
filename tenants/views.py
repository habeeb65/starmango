from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login
from django_multitenant.utils import set_current_tenant
from django.contrib import messages
from django.urls import reverse

from .models import Tenant, UserProfile, TenantSettings
from .forms import TenantRegistrationForm
from Accounts.models import Product, Customer, PurchaseVendor

def tenant_not_found(request):
    """View for when a tenant is not found"""
    return render(request, 'tenants/tenant_not_found.html')

def tenant_list(request):
    """Display a list of available tenants"""
    tenants = Tenant.objects.all()
    return render(request, 'tenants/tenant_list.html', {
        'tenants': tenants
    })

def register_tenant(request):
    """Register a new tenant with admin user"""
    if request.method == 'POST':
        form = TenantRegistrationForm(request.POST)
        if form.is_valid():
            # Create tenant
            tenant = Tenant.objects.create(
                name=form.cleaned_data['business_name'],
                slug=form.cleaned_data['slug'],
                business_type=form.cleaned_data['business_type']
            )
            
            # Create admin user for tenant
            admin_user = User.objects.create_user(
                username=form.cleaned_data['username'],
                email=form.cleaned_data['email'],
                password=form.cleaned_data['password'],
                is_staff=True
            )
            
            # Create tenant profile to link user to tenant
            UserProfile.objects.create(
                user=admin_user,
                tenant=tenant,
                is_tenant_admin=True
            )
            
            # Create tenant settings
            TenantSettings.objects.create(tenant=tenant)
            
            # Create default data based on business type
            setup_default_data(tenant)
            
            # Log the user in
            login(request, admin_user)
            
            # Redirect to the new tenant's dashboard
            messages.success(request, f"Your business '{tenant.name}' has been successfully created!")
            return redirect(reverse('dashboard', kwargs={'tenant_slug': tenant.slug}))
    else:
        form = TenantRegistrationForm()
    
    return render(request, 'tenants/register.html', {'form': form})

def setup_default_data(tenant):
    """Create default data for new tenant based on business type"""
    from django_multitenant.utils import set_current_tenant
    set_current_tenant(tenant)
    
    # Create default products based on business type
    if tenant.business_type == 'mango':
        products = ['Alphonso', 'Banganapalli', 'Totapuri', 'Kesar']
    elif tenant.business_type == 'vegetable':
        products = ['Tomato', 'Potato', 'Onion', 'Carrot']
    else:  # fruit
        products = ['Apple', 'Banana', 'Orange', 'Grapes']
    
    for product in products:
        Product.objects.create(tenant=tenant, name=product)
    
    # Create default customer and vendor
    Customer.objects.create(
        tenant=tenant,
        name="Sample Customer",
        contact_number="1234567890",
        address="Sample Address"
    )
    
    PurchaseVendor.objects.create(
        tenant=tenant,
        name="Sample Vendor",
        contact_number="9876543210",
        area="Sample Area"
    ) 