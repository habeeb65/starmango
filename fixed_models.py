from django.db import models
from django.core.exceptions import ValidationError

def clean(self):
    super().clean()
    
    # Skip validation if we're editing an existing record and not changing the quantity
    if self.pk and hasattr(self, '_loaded_quantity') and self.quantity == self._loaded_quantity:
        return
    
    # Skip validation completely if purchase_invoice is not selected yet
    if not self.purchase_invoice:
        return
        
    # Skip quantity validation if not provided yet
    if self.quantity is None:
        return

    # Check available quantity - only for new records or edited quantities
    if self.purchase_invoice.available_quantity is not None:
        # For existing records being edited, account for the current allocation
        if self.pk:
            from django.db.models import F
            # Get the original record from the database
            original = type(self).objects.get(pk=self.pk)
            # Only validate if the new quantity is greater than the original
            if self.quantity > original.quantity + self.purchase_invoice.available_quantity:
                raise ValidationError(
                    f"Only {original.quantity + self.purchase_invoice.available_quantity}kg available in {self.purchase_invoice.lot_number}"
                )
        # For new records
        elif self.quantity > self.purchase_invoice.available_quantity:
            raise ValidationError(
                f"Only {self.purchase_invoice.available_quantity}kg available in {self.purchase_invoice.lot_number}"
            )

    # Skip product check if SalesInvoice is unsaved (no primary key)
    if not hasattr(self, 'sales_invoice') or not self.sales_invoice or not self.sales_invoice.pk:
        return  # Skip validation until parent is saved

    # Check product consistency (only after SalesInvoice is saved)
    sales_products = self.sales_invoice.sales_products.all()
    if sales_products.exists():
        sales_product = sales_products.first().product
        if not self.purchase_invoice.purchase_products.filter(product=sales_product).exists():
            raise ValidationError(
                f"Lot {self.purchase_invoice.lot_number} doesn't contain {sales_product.name}"
            ) 