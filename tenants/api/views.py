from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

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