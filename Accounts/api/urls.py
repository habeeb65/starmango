from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    PurchaseVendorViewSet,
    PurchaseInvoiceViewSet,
    PurchaseProductViewSet,
    PaymentViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'vendors', PurchaseVendorViewSet)
router.register(r'invoices', PurchaseInvoiceViewSet)
router.register(r'purchase-products', PurchaseProductViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]