from rest_framework import serializers
from django.contrib.auth.models import User
from tenants.models import Tenant, UserProfile, TenantSettings

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'slug', 'business_type', 'logo', 'primary_color', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active']
        read_only_fields = ['is_active']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'tenant', 'tenant_name', 'is_tenant_admin']

class TenantSettingsSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    
    class Meta:
        model = TenantSettings
        fields = [
            'id', 'tenant', 'tenant_name', 'enable_purchase_management', 
            'enable_sales_management', 'enable_credit_dashboard', 'dashboard_layout'
        ]

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    tenant = serializers.PrimaryKeyRelatedField(queryset=Tenant.objects.all(), required=True)
    is_tenant_admin = serializers.BooleanField(required=False, default=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'tenant', 'is_tenant_admin']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        tenant = validated_data.pop('tenant')
        is_tenant_admin = validated_data.pop('is_tenant_admin', False)
        validated_data.pop('password2')
        
        user = User.objects.create_user(**validated_data)
        
        # Create user profile
        UserProfile.objects.create(
            user=user,
            tenant=tenant,
            is_tenant_admin=is_tenant_admin
        )
        
        return user