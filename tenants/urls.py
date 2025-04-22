from django.urls import path
from . import views

app_name = 'tenants'

urlpatterns = [
    path('', views.tenant_list, name='tenant_list'),
    path('register/', views.register_tenant, name='register_tenant'),
    path('not-found/', views.tenant_not_found, name='tenant_not_found'),
] 