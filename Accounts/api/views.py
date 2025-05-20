from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from Accounts.models import (
    PurchaseVendor, 
    PurchaseInvoice, 
    PurchaseProduct, 
    Product,
    Payment
)
from .serializers import (
    ProductSerializer,
    PurchaseVendorSerializer,
    PurchaseInvoiceSerializer,
    PurchaseProductSerializer,
    PaymentSerializer
)

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing products.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    
    def get_queryset(self):
        # Filter by current tenant
        return Product.objects.all()

class PurchaseVendorViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing vendors.
    """
    queryset = PurchaseVendor.objects.all()
    serializer_class = PurchaseVendorSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'contact_number', 'area']
    ordering_fields = ['name', 'area']
    
    def get_queryset(self):
        # Filter by current tenant
        return PurchaseVendor.objects.all()

class PurchaseInvoiceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing purchase invoices (lots).
    """
    queryset = PurchaseInvoice.objects.all()
    serializer_class = PurchaseInvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['vendor', 'date']
    search_fields = ['invoice_number', 'lot_number', 'vendor__name']
    ordering_fields = ['date', 'invoice_number', 'net_total']
    
    def get_queryset(self):
        # Filter by current tenant
        return PurchaseInvoice.objects.all()
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get all products for this invoice"""
        invoice = self.get_object()
        products = invoice.purchase_products.all()
        serializer = PurchaseProductSerializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        """Get all payments for this invoice"""
        invoice = self.get_object()
        payments = invoice.payments.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

class PurchaseProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing purchase products.
    """
    queryset = PurchaseProduct.objects.all()
    serializer_class = PurchaseProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['invoice', 'product']
    ordering_fields = ['serial_number', 'quantity', 'price', 'total']

class PaymentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing payments.
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['invoice', 'date', 'payment_mode']
    ordering_fields = ['date', 'amount']