from datetime import date

def generate_invoice_number():
    """
    Generate an invoice number in the format MS2025Rxx where xx is a sequential number
    """
    from .models import PurchaseInvoice
    
    last_invoice = PurchaseInvoice.objects.order_by("-id").first()
    if last_invoice and last_invoice.invoice_number:
        try:
            # Extract the last two digits and increment
            last_number = int(last_invoice.invoice_number[-2:])
        except ValueError:
            last_number = 0
        return f"MS2025R{last_number + 1:02d}"
    else:
        return "MS2025R01"  # Default starting number

def generate_lot_number():
    """
    Generate a lot number in the format LOT-xx where xx is a sequential number
    """
    from .models import PurchaseInvoice
    
    last_lot = PurchaseInvoice.objects.order_by("-id").first()
    if last_lot and last_lot.lot_number:
        try:
            last_lot_number = int(last_lot.lot_number.split("-")[-1])
        except ValueError:
            last_lot_number = 0
        return f"LOT-{last_lot_number + 1:02d}"
    else:
        return "LOT-01"  # Default starting lot number
