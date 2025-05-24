from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.utils.text import slugify
import random
import string

from tenants.models import Tenant, UserProfile, TenantSettings
from .serializers import (
    TenantSerializer, 
    UserProfileSerializer, 
    TenantSettingsSerializer,
    UserRegistrationSerializer
)

class TenantViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing tenants.
    """
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # If user is superuser, return all tenants
        user = self.request.user
        if user.is_superuser:
            return Tenant.objects.all()
        
        # Otherwise, return only the tenant the user belongs to
        try:
            profile = UserProfile.objects.get(user=user)
            return Tenant.objects.filter(id=profile.tenant.id)
        except UserProfile.DoesNotExist:
            return Tenant.objects.none()
    
    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        """Get all users for this tenant"""
        tenant = self.get_object()
        profiles = UserProfile.objects.filter(tenant=tenant)
        serializer = UserProfileSerializer(profiles, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def settings(self, request, pk=None):
        """Get settings for this tenant"""
        tenant = self.get_object()
        try:
            settings = TenantSettings.objects.get(tenant=tenant)
        except TenantSettings.DoesNotExist:
            settings = TenantSettings.objects.create(tenant=tenant)
        
        serializer = TenantSettingsSerializer(settings)
        return Response(serializer.data)

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing user profiles.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # If user is superuser, return all profiles
        user = self.request.user
        if user.is_superuser:
            return UserProfile.objects.all()
        
        # If user is tenant admin, return all profiles for their tenant
        try:
            profile = UserProfile.objects.get(user=user)
            if profile.is_tenant_admin:
                return UserProfile.objects.filter(tenant=profile.tenant)
            # Otherwise, return only their own profile
            return UserProfile.objects.filter(user=user)
        except UserProfile.DoesNotExist:
            return UserProfile.objects.none()

class TenantSettingsViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing tenant settings.
    """
    queryset = TenantSettings.objects.all()
    serializer_class = TenantSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # If user is superuser, return all settings
        user = self.request.user
        if user.is_superuser:
            return TenantSettings.objects.all()
        
        # Otherwise, return only the settings for the tenant the user belongs to
        try:
            profile = UserProfile.objects.get(user=user)
            return TenantSettings.objects.filter(tenant=profile.tenant)
        except UserProfile.DoesNotExist:
            return TenantSettings.objects.none()

class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user.profile).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class CreateTenantView(APIView):
    """
    API endpoint for creating a new tenant and associated admin user.
    This endpoint does not require authentication as it's used during signup.
    """
    permission_classes = []  # Allow unauthenticated access
    
    def post(self, request, *args, **kwargs):
        # Validate input data
        if not request.data.get('name'):
            return Response(
                {'error': 'Tenant name is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not request.data.get('email') or not request.data.get('password'):
            return Response(
                {'error': 'Email and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tenant_name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        # Generate a unique slug based on the tenant name
        base_slug = slugify(tenant_name)
        slug = base_slug
        
        # If the slug already exists, add a random string to make it unique
        if Tenant.objects.filter(slug=slug).exists():
            # Add a random 5-character alphanumeric suffix
            suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
            slug = f"{base_slug}-{suffix}"
            
            # In the very unlikely case this still exists, keep trying
            while Tenant.objects.filter(slug=slug).exists():
                suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
                slug = f"{base_slug}-{suffix}"
        
        # Create tenant with the unique slug
        tenant = Tenant.objects.create(
            name=tenant_name,
            slug=slug,
            business_type=request.data.get('business_type', 'mango'),
            contact_email=email,
            primary_color=request.data.get('primary_color', '#00897B')
        )
        
        # Create Django admin user (with staff and superuser permissions)
        username = email.split('@')[0]
        
        # Handle username conflicts by adding numbers if needed
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
            
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=True,  # Allow access to Django admin
            is_superuser=True  # Full superuser permissions
        )
        
        # Create user profile associated with tenant
        profile = UserProfile.objects.create(
            user=user,
            tenant=tenant,
            is_tenant_admin=True
        )
        
        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'tenant': TenantSerializer(tenant).data,
            'user': UserProfileSerializer(profile).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)