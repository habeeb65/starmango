from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Starmango API",
      default_version='v1',
      description="API for Starmango multi-tenant SaaS application",
      terms_of_service="https://www.starmango.com/terms/",
      contact=openapi.Contact(email="contact@starmango.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.IsAuthenticated,),
)

urlpatterns = [
    # API Documentation
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API endpoints
    path('accounts/', include('Accounts.api.urls')),
    path('tenants/', include('tenants.api.urls')),
    path('notifications/', include('notifications.api.urls')),
]