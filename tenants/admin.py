from django.contrib import admin
from .models import Tenant, UserProfile, TenantSettings

class TenantSettingsInline(admin.StackedInline):
    model = TenantSettings
    can_delete = False

@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'business_type', 'created_at')
    search_fields = ('name', 'slug')
    list_filter = ('business_type', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [TenantSettingsInline]

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'tenant', 'is_tenant_admin')
    list_filter = ('tenant', 'is_tenant_admin')
    search_fields = ('user__username', 'user__email', 'tenant__name')
    autocomplete_fields = ['user', 'tenant'] 