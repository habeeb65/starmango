from django.conf import settings

def tenant_context(request):
    """
    Add tenant information to the template context
    """
    context = {
        'is_tenant_context': hasattr(request, 'tenant'),
    }
    
    if hasattr(request, 'tenant'):
        tenant = request.tenant
        context.update({
            'current_tenant': tenant,
            'tenant_name': tenant.name,
            'tenant_slug': tenant.slug,
            'tenant_settings': tenant.settings if hasattr(tenant, 'settings') else None,
            'tenant_type': tenant.get_business_type_display(),
            'tenant_color': tenant.primary_color,
            'tenant_logo': tenant.logo.url if tenant.logo else None,
        })
    
    return context 