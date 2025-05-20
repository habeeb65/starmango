from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import login
from django_multitenant.utils import set_current_tenant
from django.contrib import messages
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponse, JsonResponse
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

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

# REST API Endpoints for tenant management
@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def tenant_api_list(request):
    """API endpoint to list all tenants and create new tenants"""
    if request.method == 'GET':
        # List all tenants
        tenants = Tenant.objects.all()
        
        # Convert tenants to a list of dictionaries
        tenant_list = [{
            'id': tenant.id,
            'name': tenant.name,
            'slug': tenant.slug,
            'business_type': tenant.business_type,
            'created_at': tenant.created_at.isoformat() if tenant.created_at else None,
        } for tenant in tenants]
        
        # Return list response for GET
        return Response({'results': tenant_list})
    
    elif request.method == 'POST':
        # Create a new tenant from POST data
        import logging
        import json
        logger = logging.getLogger(__name__)
        
        # Log the incoming request for debugging
        logger.info(f"Headers: {request.headers}")
        logger.info(f"Body: {request.body}")
        
        # Parse data from request, supporting different formats
        try:
            if isinstance(request.data, dict):
                data = request.data
            elif hasattr(request, 'body') and request.body:
                data = json.loads(request.body)
            else:
                data = {}
                
            logger.info(f"Processed data: {data}")
            
            # Extract name from various possible formats
            tenant_name = data.get('name', '')
            if not tenant_name and 'organizationName' in data:
                tenant_name = data.get('organizationName', '')
                
            if not tenant_name:
                logger.error("No tenant name provided in request")
                return Response({'error': 'Tenant name is required'}, status=400)
                
            logger.info(f"Creating tenant with name: {tenant_name}")
            
            # Create tenant with minimal required fields
            tenant = Tenant.objects.create(
                name=tenant_name,
                slug=tenant_name.lower().replace(' ', '-'),  # Generate slug from name
                business_type='mango'  # Default business type
            )
            
            # Return tenant data with success status
            response_data = {
                'id': tenant.id,
                'name': tenant.name,
                'slug': tenant.slug,
                'business_type': tenant.business_type,
                'created_at': tenant.created_at.isoformat() if tenant.created_at else None,
            }
            
            logger.info(f"Successfully created tenant: {response_data}")
            return Response(response_data, status=201)
            
        except json.JSONDecodeError as je:
            logger.error(f"JSON decode error: {str(je)}")
            return Response({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            logger.error(f"Error creating tenant: {str(e)}")
            return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_tenant_api(request):
    """API endpoint to create a new tenant"""
    data = request.data
    
    try:
        # Create tenant
        tenant = Tenant.objects.create(
            name=data.get('name'),
            slug=data.get('name').lower().replace(' ', '-'),  # Generate slug from name
            business_type=data.get('business_type', 'mango')
        )
        
        # Return tenant data
        return Response({
            'id': tenant.id,
            'name': tenant.name,
            'slug': tenant.slug,
            'business_type': tenant.business_type,
            'created_at': tenant.created_at.isoformat() if tenant.created_at else None,
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)