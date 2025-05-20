from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import (
    TenantViewSet,
    UserProfileViewSet,
    TenantSettingsViewSet,
    UserRegistrationView
)

router = DefaultRouter()
router.register(r'tenants', TenantViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'settings', TenantSettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Authentication endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', UserRegistrationView.as_view(), name='register'),
]