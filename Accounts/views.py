from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, LongTable
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from django.conf import settings
from .models import PurchaseInvoice
from decimal import Decimal
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os
from reportlab.lib.units import inch
from reportlab.platypus import Frame
from django.db.models import Sum, F, ExpressionWrapper, DecimalField, Q
from .models import PurchaseVendor, PurchaseInvoice
from .models import SalesInvoice, Expense, Damages, Packaging_Invoice
from django.http import JsonResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.contrib.staticfiles.finders import find
import base64
from django.contrib.admin.views.decorators import staff_member_required
from .models import PurchaseInvoice, SalesInvoice, Expense, Damages, PurchaseVendor, Customer, Packaging_Invoice, PurchaseProduct
from django.urls import reverse
from django.utils.dateparse import parse_date
import datetime  # Import datetime module instead of just datetime class


# Font and Logo Setup
FONT_PATH = os.path.join(os.path.dirname(__file__), 'Font', 'DejaVuSans.ttf')
BOLD_FONT_PATH = os.path.join(os.path.dirname(__file__), 'Font', 'DejaVuSans-Bold.ttf')
FONT_PATH = os.path.join(os.path.dirname(__file__), 'Font', 'NotoSans.ttf')
BOLD_FONT_PATH = os.path.join(os.path.dirname(__file__), 'Font', 'NotoSans-Bold.ttf')
pdfmetrics.registerFont(TTFont('DejaVuSans', FONT_PATH))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', BOLD_FONT_PATH))
pdfmetrics.registerFont(TTFont('NotoSans', FONT_PATH))
pdfmetrics.registerFont(TTFont('NotoSans-Bold', BOLD_FONT_PATH))

@staff_member_required
def admin_dashboard(request):
    """
    Admin dashboard view that follows the same pattern as vendor_purchase_summary
    with date filtering capabilities
    """
    # Get filter parameters
    from_date_str = request.GET.get('from_date')
    to_date_str = request.GET.get('to_date')
    
    # Parse dates
    from_date = parse_date(from_date_str) if from_date_str else None
    to_date = parse_date(to_date_str) if to_date_str else None
    
    # Default to last 30 days if no dates provided
    if not from_date and not to_date:
        to_date = datetime.date.today()
        from_date = to_date - datetime.timedelta(days=30)
        from_date_str = from_date.strftime('%Y-%m-%d')
        to_date_str = to_date.strftime('%Y-%m-%d')
    
    # Filter purchase invoices by date if provided
    purchase_invoices = PurchaseInvoice.objects.all()
    if from_date:
        purchase_invoices = purchase_invoices.filter(date__gte=from_date)
    if to_date:
        purchase_invoices = purchase_invoices.filter(date__lte=to_date)
    
    # Calculate total purchases
    total_purchase = purchase_invoices.aggregate(total=Sum('net_total'))['total'] or Decimal('0')

    # Filter sales invoices by date if provided
    sales_invoices = SalesInvoice.objects.all()
    if from_date:
        sales_invoices = sales_invoices.filter(invoice_date__gte=from_date)
    if to_date:
        sales_invoices = sales_invoices.filter(invoice_date__lte=to_date)
    
    # Calculate total sales
    sales_with_totals = sales_invoices.annotate(computed_total=Sum('sales_products__total'))
    total_sales = sum(s.computed_total or 0 for s in sales_with_totals)

    # Filter expenses by date if provided
    expenses = Expense.objects.all()
    if from_date:
        expenses = expenses.filter(date__gte=from_date)
    if to_date:
        expenses = expenses.filter(date__lte=to_date)
    
    # Calculate total expenses
    total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or Decimal('0')

    # Filter damages by date if provided
    damages = Damages.objects.all()
    if from_date:
        damages = damages.filter(date__gte=from_date)
    if to_date:
        damages = damages.filter(date__lte=to_date)
    
    # Calculate total damages
    total_damages = damages.aggregate(total=Sum('amount_loss'))['total'] or Decimal('0')

    # Get all packaging invoices - Packaging_Invoice doesn't have a date field to filter
    packaging_invoices = Packaging_Invoice.objects.all()
    
    # Calculate total packaging cost
    total_packaging_cost = sum([pi.packaging_total for pi in packaging_invoices])

    # Profit and Loss Calculation
    profit_loss = total_sales - (total_purchase + total_expenses + total_packaging_cost + total_damages)

    # Highest Due Customers
    highest_due_customers = Customer.objects.annotate(
        total_sales_amount=Sum('sales_invoices__sales_products__total'),
        total_paid_amount=Sum('sales_invoices__payments__amount')
    ).annotate(
        due=ExpressionWrapper(
            F('total_sales_amount') - F('total_paid_amount'),
            output_field=DecimalField()
        )
    ).order_by('-due')[:5]

    # Highest Due Vendors
    highest_due_vendors = PurchaseVendor.objects.annotate(
        total_purchase_amount=Sum('invoices__net_total'),
        total_paid_amount=Sum('invoices__payments__amount')
    ).annotate(
        due=ExpressionWrapper(
            F('total_purchase_amount') - F('total_paid_amount'),
            output_field=DecimalField()
        )
    ).order_by('-due')[:5]

    # Available lots - fetch all and filter in Python since available_quantity is a property
    all_lots = PurchaseInvoice.objects.prefetch_related('purchase_products', 'sales_lots').order_by('-date')[:50]  # Fetch recent ones
    available_lots = [lot for lot in all_lots if lot.available_quantity > 0][:10]

    context = {
        'total_purchase': total_purchase,
        'total_sales': total_sales,
        'total_expenses': total_expenses,
        'total_damages': total_damages,
        'total_packaging_cost': total_packaging_cost,
        'profit_loss': profit_loss,
        'highest_due_vendors': highest_due_vendors,
        'highest_due_customers': highest_due_customers,
        'available_lots': available_lots,
        'from_date': from_date_str,
        'to_date': to_date_str,
    }
    return render(request, 'Accounts/admin_dashboard.html', context)

@staff_member_required
def dashboard(request):
    # Total Purchases
    total_purchase = PurchaseInvoice.objects.aggregate(total=Sum('net_total'))['total'] or Decimal('0')

    # Total Sales
    sales_with_totals = SalesInvoice.objects.annotate(
    computed_total=Sum('sales_products__total'))
    total_sales = sum(s.computed_total or 0 for s in sales_with_totals)

    # Total Expenses
    total_expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or Decimal('0')

    # Total Damages
    total_damages = Damages.objects.aggregate(total=Sum('amount_loss'))['total'] or Decimal('0')

    # Total Packaging Cost
    packaging_invoices = Packaging_Invoice.objects.all()
    total_packaging_cost = sum([pi.packaging_total for pi in packaging_invoices])

    # Profit and Loss Calculation
    profit_loss = total_sales - (total_purchase + total_expenses + total_packaging_cost + total_damages)

    highest_due_customers = Customer.objects.annotate(
    total_sales_amount=Sum('sales_invoices__sales_products__total'),
    total_paid_amount=Sum('sales_invoices__payments__amount')
).annotate(
    due=ExpressionWrapper(
        F('total_sales_amount') - F('total_paid_amount'),
        output_field=DecimalField()
    )
).order_by('-due')[:5]

    # Highest Due Vendors
    highest_due_vendors = PurchaseVendor.objects.annotate(
    total_purchase_amount=Sum('invoices__net_total'),
    total_paid_amount=Sum('invoices__payments__amount')
).annotate(
    due=ExpressionWrapper(
        F('total_purchase_amount') - F('total_paid_amount'),
        output_field=DecimalField()
    )
).order_by('-due')[:5]

    # Available lots - fetch all and filter in Python since available_quantity is a property
    all_lots = PurchaseInvoice.objects.prefetch_related('purchase_products', 'sales_lots').order_by('-date')[:50]  # Fetch recent ones
    available_lots = [lot for lot in all_lots if lot.available_quantity > 0][:10]  # Filter in Python and limit to 10

    context = {
        'total_purchase': total_purchase,
        'total_sales': total_sales,
        'total_expenses': total_expenses,
        'total_damages': total_damages,
        'total_packaging_cost': total_packaging_cost,
        'profit_loss': profit_loss,
        'highest_due_vendors': highest_due_vendors,
        'highest_due_customers': highest_due_customers,
        'available_lots': available_lots,
    }
    return render(request, 'admin/dashboard.html', context)

def get_base64_image(image_path):
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Warning: Image file not found at {image_path}")
        return None

def find(path):
    result = finders.find(path)
    if result:
        if isinstance(result, (list, tuple)):
            # Return the first path if it's a list/tuple
            return result[0]
        return result
    return None

def create_invoice(request):
    return render(request, 'Accounts/create_invoice.html')

def generate_invoice_pdf(request, invoice_id):
    # Fetch invoice
    invoice = get_object_or_404(PurchaseInvoice, id=invoice_id)
    # Check if "hide_payments" parameter exists in the URL
    hide_payments = request.GET.get('hide_payments', False)

    # Set up PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{invoice.invoice_number}.pdf"'

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=20, bottomMargin=30)

    elements = []  # Correct indentation here

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=16, alignment=1, textColor=colors.black)

    # Add Title
    elements.append(Paragraph("PURCHASE INVOICE", title_style))

    # Add logo
    logo_path = os.path.join(settings.STATICFILES_DIRS[0], 'LOGO.png')  # Ensure the path is correct
    if os.path.exists(logo_path):
        logo = Image(logo_path, width=2*inch, height=1.5*inch)  # Adjust size as needed
        logo.hAlign = 'CENTER'  # Align the logo to the center of its cell
    else:
        print(f"Logo file not found at {logo_path}")

    # Add Vendor Info Table with yellow highlights
    vendor_data = [
        ["Name:", invoice.vendor.name, "DATE", invoice.date.strftime('%d-%m-%Y')],
        ["Contact No:", invoice.vendor.contact_number, "INVOICE NO.", invoice.invoice_number],
        ["Area:", invoice.vendor.area, "LOT NO.", invoice.lot_number],
        
    ]
    vendor_table = Table(vendor_data, colWidths=[1*inch, 2*inch, 1*inch, 1.15*inch])
    vendor_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),  # Grid lines for table
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),  # Align text to the left
        ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),  # Font for the table
        ('FONTSIZE', (0, 0), (-1, -1), 10),  # Font size
        ('BACKGROUND', (0, 0), (0, 0), colors.yellow),  # Highlight "Name:" in yellow
        ('BACKGROUND', (0, 1), (0, 1), colors.yellow),  # Highlight "Contact No:" in yellow
        ('BACKGROUND', (0, 2), (0, 2), colors.yellow),  # Highlight "Area:" in yellow
        ('BACKGROUND', (2, 0), (2, 0), colors.yellow),  # Highlight "DATE" in yellow
        ('BACKGROUND', (2, 1), (2, 1), colors.yellow),  # Highlight "INVOICE NO." in yellow
        ('BACKGROUND', (2, 2), (2, 2), colors.yellow),  # Highlight "LOT NO." in yellow
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  # Black text for headers
    ]))

    # Create a new table to place the logo and vendor info side by side
    side_by_side_table = Table([[logo, vendor_table]], colWidths=[2.5*inch, 5*inch])  # Adjust widths as needed

    # Add the side-by-side table to the elements list
    elements.append(side_by_side_table)
    elements.append(Spacer(1, 20))  # Add space after the logo and table

    

    # Product Table with yellow header
    product_data = [
        ["S/No", "Product Name", "QTY in Kg's", "UNIT PRICE", "Damage (Kg)", "Discount %", "Rotten (Kg)", "Unloading", "TOTAL"]
    ]
    for idx, product in enumerate(invoice.purchase_products.all(), start=1):
        product_data.append([
            idx, product.product.name, f"{product.quantity:.2f}", f"₹{product.price:.2f}",
            f"{product.damage:.2f}",
            f"{product.discount:.2f}%",
            f"{product.rotten:.2f}",
            f"₹{product.loading_unloading:.2f}", f"₹{product.total:.2f}"
        ])
    product_table = LongTable(product_data, colWidths=[0.4*inch, 1.5*inch, 0.8*inch, 0.8*inch, 1*inch, 0.8*inch, 0.8*inch, 1*inch, 0.9*inch])
    product_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.yellow),  # Yellow background for header
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  # Black text for header
    ]))
    elements.append(product_table)
    elements.append(Spacer(1, 20))

    # Only show payment details if hide_payments is not True
    if not hide_payments:
        # Paid Amounts Section
        paid_data = [["Paid Amount", "Date"]]
        for payment in invoice.payments.all():  # Assuming 'payments' is a related name for payments in the PurchaseInvoice model
            paid_data.append([f"₹{payment.amount:.2f}", payment.date.strftime('%Y-%m-%d')])

        paid_data.append(["Total Paid:", f"₹{invoice.paid_amount:.2f}"])

        paid_table = Table(paid_data, colWidths=[2*inch, 1.8*inch])
        paid_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
            ('BACKGROUND', (0, 0), (0, 0), colors.yellow),  # Yellow header for "Paid Amount" and "Date"
            ('FONTNAME', (0, -1), (-1, -1), 'DejaVuSans-Bold'),  # Bold for Total Paid row
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  # Black text for header
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('FONTSIZE', (0, -1), (-1, -1), 12),  # Larger font for Total Paid
        ]))
        
        # Payment Summary with yellow highlighting
        payment_data = [
            ["NET TOTAL", f"₹{invoice.net_total:.2f}"],
            ["2% CASH COMMISSION", f"₹{(invoice.net_total * Decimal('0.02')):.2f}"],
            ["NET TOTAL AFTER CASH CUTTING", f"₹{invoice.net_total_after_cash_cutting:.2f}"],
            ["TOTAL PAID", f"₹{invoice.paid_amount:.2f}"],
            ["BALANCE DUE", f"₹{invoice.due_amount:.2f}"],
        ]
        

        payment_table = Table(payment_data, colWidths=[2.5*inch, 1.4*inch])
        payment_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
            ('FONTNAME', (0, -1), (-1, -1), 'DejaVuSans-Bold'),  
        

            ('BACKGROUND', (0, 0), (-1, 0), colors.yellow),  # Yellow background for the header
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),  # Black text for header
            ('FONTSIZE', (0, 0), (-1, -1), 10),
        ]))
        
        #elements.append(payment_table)
        paid_and_payment_table = Table(
            [[paid_table, payment_table]],  # Add both tables as cells in a single row
            colWidths=[4*inch, 4*inch]  # Adjust column widths as needed
        )

        

        # Add the combined table to the elements list
        elements.append(paid_and_payment_table)
        elements.append(Spacer(1, 20))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    response.write(buffer.read())
    return response

def vendor_summary(request):
    vendors = PurchaseVendor.objects.all()
    selected_vendor_id = request.GET.get('vendor_id')
    year = request.GET.get('year')
    purchases = []
    total_amount = 0

    if selected_vendor_id:
        purchases = PurchaseInvoice.objects.filter(vendor_id=selected_vendor_id)
        if year:
            purchases = purchases.filter(date__year=year)  # Extract the year from the date field
            total_amount = purchases.aggregate(Sum('net_total'))['net_total__sum'] or 0

    context = {
        'vendors': vendors,
        'purchases': purchases,
        'total_amount': total_amount,
        'selected_vendor_id': selected_vendor_id,
        'year': year,
    }
    return render(request, 'vendor_summary.html', context)

def generate_sales_invoice_pdf(request, invoice_id):
    invoice = get_object_or_404(SalesInvoice, id=invoice_id)
    # Check if "hide_payments" parameter exists in the URL
    hide_payments = request.GET.get('hide_payments', False)
    # Set up PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="sales_invoice_{invoice.invoice_number}.pdf"'

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=20,
        leftMargin=20,
        topMargin=20,
        bottomMargin=30
    )

    elements = []
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Title'], fontSize=16,
                                 alignment=1, textColor=colors.black)

    

    # Add Title
    elements.append(Paragraph("SALES INVOICE", title_style))
    elements.append(Spacer(1, 12))

    # Add logo
    # Logo and Header Section
    logo_header_table = []

    # Add Logo (if available)
    logo_path = os.path.join(settings.STATICFILES_DIRS[0], 'LOGO.png')  # Updated path
    if os.path.exists(logo_path):
        try:
            logo = Image(logo_path, width=2*inch, height=1.5*inch)
            logo.hAlign = 'CENTER'
            # Create a logo cell with proper padding
            logo_cell = [[logo]]
            logo_table = Table(logo_cell, hAlign='LEFT')
            logo_table.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
            ]))
            logo_header_table.append(logo_table)
        except Exception as e:
            print(f"Error loading logo: {str(e)}")
    else:
        print(f"Logo file not found at {logo_path}")

    # Create header table
    header_data = [
        ["",""],
        [ "Invoice Number:", invoice.invoice_number, "Date:", invoice.invoice_date.strftime('%d-%m-%Y')],
        ["Vendor Name:", invoice.vendor.name,],
        ["Contact No:", invoice.vendor.contact_number or "N/A", "Vehicle No.", invoice.vehicle_number or "N/A" ],
        [ "Reference", invoice.reference or "", "Gross Vehicle Weight:", f"{invoice.gross_vehicle_weight}"],
        ["LOT NO:", ", ".join([sl.purchase_invoice.lot_number for sl in invoice.sales_lots.all()]) or "N/A", "", ""],
    ]

    header_table = Table(header_data, colWidths=[1.25*inch, 1.5*inch, 1.75*inch, 1.5*inch])
    header_table.setStyle(TableStyle([
      
        
        ('SPAN', (1, 5), (3, 5)),  # (col_start, row_start), (col_end, row_end)
        ('SPAN', (1, 2), (3, 2)),  # (col_start, row_start), (col_end, row_end)
    # Align LOT NO text to the left
        ('ALIGN', (1, 5), (3, 5), 'LEFT'),
        ('GRID', (0,1), (-1,-1), 0.5, colors.grey),
        ('FONTNAME', (2,1), (3,-1), 'Helvetica-Bold'),
        ('FONTNAME', (0,1), (3,-1), 'Helvetica-Bold'),
        ('ALIGN', (2,1), (3,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0, 1), (0, 1), colors.yellow), 
        ('BACKGROUND', (0, 2), (0, 2), colors.yellow), 
        ('BACKGROUND', (0, 3), (0, 3), colors.yellow), 
        ('BACKGROUND', (0, 4), (0, 4), colors.yellow),
        ('BACKGROUND', (2, 1), (2, 1), colors.yellow), 
        ('BACKGROUND', (2, 3), (2, 3), colors.yellow), 
       
        ('BACKGROUND', (2, 4), (2, 4), colors.yellow),
        ('BACKGROUND', (0, 5), (0, 5), colors.yellow),
    ]))

    # Combine logo and header into a single row
    if logo_header_table:
        final_header = [[logo_header_table[0], header_table]]
        col_widths = [2.5*inch, 6.5*inch]
    else:
        final_header = [[header_table]]
        col_widths = [8.5*inch]

    main_header = Table(final_header, colWidths=col_widths)
    main_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
    ]))

    elements.append(main_header)
    elements.append(Spacer(1, 20))

    # Sales Product Table - Improved layout
    product_header = [
        "S/No", "Product", "Gross Weight", "Net Weight", 
        "Price/Kg", "Discount", "Rotten", "Total"
    ]
    product_data = [product_header]
    
    for idx, sp in enumerate(invoice.sales_products.all(), start=1):
        product_data.append([
            str(idx),
            sp.product.name,
            f"{sp.gross_weight:.2f} Kg",
            f"{sp.net_weight:.2f} Kg",
            f"₹ {sp.price:.2f}",
            f"{sp.discount:.2f}%",
            f"{sp.rotten:.2f} Kg",
            f"₹{sp.total:.2f}"
        ])
    
    product_table = Table(product_data, 
                         colWidths=[0.4*inch, 1.8*inch, 1*inch, 1*inch, 
                                   0.9*inch, 0.8*inch, 0.9*inch, 1.2*inch])
    
    product_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.yellow),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
    ]))
    
    elements.append(product_table)
    elements.append(Spacer(1, 20))

    # Enhanced Summary Section
    summary_data = [
        ["Total Gross Weight:", f"{invoice.total_gross_weight:.2f} Kg"],
        ["Net Total:", f"₹{invoice.net_total:.2f}"],
        ["Commission:", f"₹{invoice.net_total_after_commission - invoice.net_total:.2f}"],
        ["Net Total After Commission:", f"₹{invoice.net_total_after_commission:.2f}"],
        ["No of Crates:", f"{invoice.no_of_crates or 0}"],
        ["Packaging cost per crate:", f"₹{invoice.cost_per_crate or 0:.2f}"],
        ["Total packaging cost:", f"₹{invoice.packaging_total:.2f}"],
        ["No of Purchased Crates:", f"{invoice.purchased_crates_quantity or 0}"],
        ["Purchased price per crate:", f"₹{invoice.purchased_crates_unit_price or 0:.2f}"],
        ["Purchased crates total:", f"₹{invoice.purchased_crates_total:.2f}"],
        ["Final Invoice Total:", f"₹{invoice.net_total_after_packaging:.2f}"]
    ]
    
    summary_table = Table(summary_data, colWidths=[2.5*inch, 1.5*inch])
    summary_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
        ('FONTNAME', (0, 0), (0, -1), 'DejaVuSans-Bold'),
        ('BACKGROUND', (0, 0), (0, 0), colors.yellow),
        ('BACKGROUND', (0, 1), (0, 1), colors.yellow),
        ('BACKGROUND', (0, 2), (0, 2), colors.yellow),
        ('BACKGROUND', (0, 3), (0, 3), colors.yellow),
        ('BACKGROUND', (0, 4), (0, 4), colors.yellow),
        ('BACKGROUND', (0, 5), (0, 5), colors.yellow),
        ('BACKGROUND', (0, 6), (0, 6), colors.yellow),
        ('BACKGROUND', (0, 7), (0, 7), colors.yellow),
        ('BACKGROUND', (0, 8), (0, 8), colors.yellow),
        ('BACKGROUND', (0, 9), (0, 9), colors.yellow),
        ('BACKGROUND', (0, 10), (0, 10), colors.yellow),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('FONTSIZE', (0, 10), (0, 10), 14),
        ('FONTSIZE', (1, 10), (1, 10), 14),
        ('FONTNAME', (1, 10), (1, 10), 'DejaVuSans-Bold'),
        ('TEXTCOLOR', (0, -1), (0, -1), colors.black),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 12),
    ]))
    
    left_aligned_summary = Table([[summary_table]], colWidths=[4*inch])
    left_aligned_summary.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 140),
    ]))

    elements.append(left_aligned_summary)
    elements.append(Spacer(1, 25))
    if not hide_payments:
    # Payment Details Section
    # Payment Details Section - Updated to match purchase invoice style
        paid_data = [["Paid Amount", "Date"]]
        for payment in invoice.payments.all():
            paid_data.append([f"₹{payment.amount:.2f}", payment.date.strftime('%Y-%m-%d')])
        paid_data.append(["Total Paid:", f"₹{invoice.paid_amount:.2f}"])

        paid_table = Table(paid_data, colWidths=[2*inch, 1.8*inch])
        paid_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
            ('BACKGROUND', (0, 0), (0, 0), colors.yellow),
            ('BACKGROUND', (1, 0), (1, 0), colors.yellow),
            ('FONTNAME', (0, -1), (-1, -1), 'DejaVuSans-Bold'),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('FONTSIZE', (0, -1), (-1, -1), 12),
        ]))

        # Payment Summary Table with yellow highlights
        payment_summary_data = [
            ["FINAL INVOICE TOTAL", f"₹{invoice.net_total_after_packaging:.2f}"],
            ["TOTAL PAID", f"₹{invoice.paid_amount:.2f}"],
            ["BALANCE DUE", f"₹{invoice.due_amount:.2f}"],
        ]
        
        payment_summary_table = Table(payment_summary_data, colWidths=[2.5*inch, 1.4*inch])
        payment_summary_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
            ('FONTNAME', (0, -1), (-1, -1), 'DejaVuSans-Bold'),
            ('BACKGROUND', (0, 0), (-1, 0), colors.yellow),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
        ]))

        # Combine payment tables side by side
        combined_payments = Table([[paid_table, payment_summary_table]],
                                colWidths=[4*inch, 4*inch])
        
        elements.append(combined_payments)
        elements.append(Spacer(1, 20))

    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    response.write(buffer.read())
    return response

def generate_expense_pdf(request, pk):
    expense = Expense.objects.get(pk=pk)

    # Get static files paths for fonts
    font_normal = find('NotoSans.ttf')
    font_bold = find('NotoSans-Bold.ttf')

    # Get the logo path (ensure it exists!)
    logo_file_path = find('LOGO.png')

    if not logo_file_path:
        raise FileNotFoundError("LOGO.png not found in static files!")

    # Base64 encode the logo
    logo_base64 = get_base64_image(logo_file_path)

    # Fix path for fonts
    def fix_path(path):
        return path.replace('\\', '/') if os.name == 'nt' else path

    context = {
        'expense': expense,
        'logo_path': logo_base64,  # Base64 encoded image for embedding
        'noto_sans_path': f"file://{fix_path(font_normal)}" if font_normal else '',
        'noto_sans_bold_path': f"file://{fix_path(font_bold)}" if font_bold else ''
    }

    return render_to_pdf('expense_pdf.html', context)


def generate_damage_pdf(request, pk):
    damage = Damages.objects.get(pk=pk)

    # Get static files paths for fonts
    font_normal = find('NotoSans.ttf')
    font_bold = find('NotoSans-Bold.ttf')

    # Get the logo path (ensure it exists!)
    logo_file_path = find('LOGO.png')

    if not logo_file_path:
        raise FileNotFoundError("LOGO.png not found in static files!")

    # Base64 encode the logo
    logo_base64 = get_base64_image(logo_file_path)

    # Fix path for fonts
    def fix_path(path):
        return path.replace('\\', '/') if os.name == 'nt' else path

    context = {
        'damage': damage,
        'logo_path': logo_base64,  # Base64 encoded image for embedding
        'noto_sans_path': f"file://{fix_path(font_normal)}" if font_normal else '',
        'noto_sans_bold_path': f"file://{fix_path(font_bold)}" if font_bold else ''
    }

    return render_to_pdf('damage_pdf.html', context)

# Generic PDF renderer (reuse existing if you have one)
def render_to_pdf(template_path, context):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'filename="document.pdf"'
    
    template = get_template(template_path)
    html = template.render(context)

    pisa_status = pisa.CreatePDF(
        html, dest=response,
        encoding='UTF-8'
    )

    if pisa_status.err:
        return HttpResponse('Error generating PDF')
    return response

def generate_packaging_invoice_pdf(request, invoice_id):
    invoice = get_object_or_404(Packaging_Invoice, id=invoice_id)
    
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="packaging_invoice_{invoice.id}.pdf"'
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                          rightMargin=20, leftMargin=20,
                          topMargin=20, bottomMargin=30)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom style with DejaVu font
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Title'],
        fontSize=16,
        alignment=1,
        textColor=colors.black,
        fontName='DejaVuSans-Bold'
    )
    
    # Add Logo and Header
    logo_header = []
    logo_path = os.path.join(settings.STATICFILES_DIRS[0], 'LOGO.png')
    
    if os.path.exists(logo_path):
        try:
            logo = Image(logo_path, width=2*inch, height=1.5*inch)
            logo.hAlign = 'LEFT'
            logo_table = Table([[logo]], colWidths=[2*inch])
            logo_table.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'LEFT'),
                ('LEFTPADDING', (0,0), (-1,-1), -50),
            ]))
            logo_header.append(logo_table)
        except Exception as e:
            print(f"Error loading logo: {str(e)}")
    
    # Create header table
    header_data = [
        ["PACKAGING INVOICE", ""],
        ["Invoice ID:", f"PKG-{invoice.id}"],  # Using invoice ID instead of date
    ]
    
    header_table = Table(header_data, colWidths=[3*inch, 3*inch])
    header_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'DejaVuSans'),
        ('FONTSIZE', (0,0), (-1,0), 14),
        ('FONTNAME', (0,0), (-1,0), 'DejaVuSans-Bold'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    # Combine logo and header
    if logo_header:
        main_header = Table([[logo_header[0], header_table]], 
                          colWidths=[2*inch, 4*inch])
    else:
        main_header = header_table
        
    elements.append(main_header)
    elements.append(Spacer(1, 20))
    
    invoice_data = [
        ["Number of Crates:", str(invoice.no_of_crates)],
        ["Cost Per Crate:", f"₹{invoice.cost_per_crate:.2f}"],
        ["Total Packaging Cost:", f"₹{invoice.packaging_total:.2f}"]
    ]
    
    invoice_table = Table(invoice_data, colWidths=[2*inch, 4*inch])
    invoice_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('FONTNAME', (0,0), (-1,0), 'DejaVuSans-Bold'),
        ('FONTNAME', (0,1), (-1,-1), 'DejaVuSans'),
        ('BACKGROUND', (0,0), (-1,0), colors.yellow),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    elements.append(invoice_table)
    elements.append(Spacer(1, 20))
    
    # Footer with custom font
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=10,
        leading=12,
        textColor=colors.darkgrey,
        fontName='DejaVuSans'
    )
    # Footer
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=10,
        leading=12,
        textColor=colors.darkgrey
    )
    footer_text = '''<para>
    Prepared By: _______________________ &nbsp;&nbsp;&nbsp;&nbsp; 
    Approved By: _______________________<br/>
    Signature: _______________________ &nbsp;&nbsp;&nbsp;&nbsp; 
    Signature: _______________________
    </para>'''
    
    elements.append(Paragraph(footer_text, footer_style))
    
    doc.build(elements)
    buffer.seek(0)
    response.write(buffer.read())
    buffer.close()
    return response


def homepage(request):
    """Displays a simple homepage with a link to the admin."""
    admin_url = reverse('admin:index') # Get the URL for the admin index
    html_content = f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>StarMango</title>
        <style>
            body {{ font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; }}
            a.button {{ padding: 15px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 1.2em; }}
            a.button:hover {{ background-color: #45a049; }}
        </style>
    </head>
    <body>
        <h1>Welcome to StarMango</h1>
        <a href="{admin_url}" class="button">Go to Admin Panel</a>
    </body>
    </html>
    '''
    return HttpResponse(html_content)

def vendor_purchase_summary(request):
    # Get filter parameters
    from_date_str = request.GET.get('from_date')
    to_date_str = request.GET.get('to_date')
    search_query = request.GET.get('search', '')
    sort_by = request.GET.get('sort', 'name') # Default sort by name
    
    # Parse dates
    from_date = parse_date(from_date_str) if from_date_str else None
    to_date = parse_date(to_date_str) if to_date_str else None
    
    # Base queryset - get unique vendors
    vendor_qs = PurchaseVendor.objects.all().distinct()
    
    # Apply search filter
    if search_query:
        vendor_qs = vendor_qs.filter(
            Q(name__icontains=search_query) | 
            Q(contact_number__icontains=search_query) | 
            Q(area__icontains=search_query)
        )
    
    # Get all vendors first, then we'll calculate totals manually
    vendors = list(vendor_qs)
    vendor_data = []
    
    for vendor in vendors:
        # Get all purchase invoices for this vendor
        purchase_invoices = vendor.invoices.all()
        
        # Apply date filters
        if from_date:
            purchase_invoices = purchase_invoices.filter(date__gte=from_date)
        if to_date:
            purchase_invoices = purchase_invoices.filter(date__lte=to_date)
        
        # Calculate totals
        total_purchases = sum(invoice.net_total for invoice in purchase_invoices)
        total_cash_cutting = sum(invoice.net_total * Decimal('0.02') for invoice in purchase_invoices)
        total_payments = sum(invoice.paid_amount for invoice in purchase_invoices)
        due_amount = total_purchases - total_cash_cutting - total_payments
        
        # Add calculated data
        vendor.total_purchases = total_purchases
        vendor.total_payments = total_payments
        vendor.due_amount = due_amount
        vendor_data.append(vendor)
    
    # Apply sorting
    valid_sort_fields = ['name', 'total_purchases', 'total_payments', 'due_amount']
    sort_field = sort_by
    reverse_sort = False
    
    if sort_by.startswith('-'):
        sort_field = sort_by[1:]
        reverse_sort = True
    
    if sort_field in valid_sort_fields:
        if sort_field == 'name':
            vendor_data.sort(key=lambda v: v.name, reverse=reverse_sort)
        elif sort_field == 'total_purchases':
            vendor_data.sort(key=lambda v: v.total_purchases, reverse=reverse_sort)
        elif sort_field == 'total_payments':
            vendor_data.sort(key=lambda v: v.total_payments, reverse=reverse_sort)
        elif sort_field == 'due_amount':
            vendor_data.sort(key=lambda v: v.due_amount, reverse=reverse_sort)

    context = {
        'vendors': vendor_data,
        'from_date': from_date_str,
        'to_date': to_date_str,
        'search_query': search_query,
        'sort_by': sort_by,
    }
    return render(request, 'Accounts/vendor_purchase_summary.html', context)

def customer_purchase_summary(request):
    # Get filter parameters
    from_date_str = request.GET.get('from_date')
    to_date_str = request.GET.get('to_date')
    search_query = request.GET.get('search', '')
    sort_by = request.GET.get('sort', 'name') # Default sort by name
    
    # Parse dates
    from_date = parse_date(from_date_str) if from_date_str else None
    to_date = parse_date(to_date_str) if to_date_str else None
    
    # Base queryset - get unique customers
    customer_qs = Customer.objects.all().distinct()
    
    # Apply search filter
    if search_query:
        customer_qs = customer_qs.filter(
            Q(name__icontains=search_query) | 
            Q(contact_number__icontains=search_query) | 
            Q(address__icontains=search_query)
        )
        
    # Create base invoice filter for dates
    invoice_date_filter = Q()
    if from_date:
        invoice_date_filter &= Q(sales_invoices__invoice_date__gte=from_date)
    if to_date:
        invoice_date_filter &= Q(sales_invoices__invoice_date__lte=to_date)
        
    # Get all customers first, then we'll calculate totals manually
    customers = list(customer_qs)
    customer_data = []
    
    for customer in customers:
        # Get all sales invoices for this customer
        sales_invoices = customer.sales_invoices.all()
        
        # Apply date filters
        if from_date:
            sales_invoices = sales_invoices.filter(invoice_date__gte=from_date)
        if to_date:
            sales_invoices = sales_invoices.filter(invoice_date__lte=to_date)
        
        # Calculate totals
        total_sales = sum(invoice.net_total_after_packaging for invoice in sales_invoices)
        total_payments = sum(invoice.paid_amount for invoice in sales_invoices)
        due_amount = total_sales - total_payments
        
        # Add calculated data
        customer.total_sales = total_sales
        customer.total_payments = total_payments
        customer.due_amount = due_amount
        customer_data.append(customer)
    
    # Apply sorting
    valid_sort_fields = ['name', 'total_sales', 'total_payments', 'due_amount']
    sort_field = sort_by
    reverse_sort = False
    
    if sort_by.startswith('-'):
        sort_field = sort_by[1:]
        reverse_sort = True
    
    if sort_field in valid_sort_fields:
        if sort_field == 'name':
            customer_data.sort(key=lambda c: c.name, reverse=reverse_sort)
        elif sort_field == 'total_sales':
            customer_data.sort(key=lambda c: c.total_sales, reverse=reverse_sort)
        elif sort_field == 'total_payments':
            customer_data.sort(key=lambda c: c.total_payments, reverse=reverse_sort)
        elif sort_field == 'due_amount':
            customer_data.sort(key=lambda c: c.due_amount, reverse=reverse_sort)
    
    context = {
        'customers': customer_data,
        'from_date': from_date_str,
        'to_date': to_date_str,
        'search_query': search_query,
        'sort_by': sort_by,
    }
    return render(request, 'Accounts/customer_purchase_summary.html', context)

def vendor_invoice_detail(request, vendor_id):
    vendor = get_object_or_404(PurchaseVendor, id=vendor_id)
    
    # Get filter parameters
    from_date_str = request.GET.get('from_date')
    to_date_str = request.GET.get('to_date')
    
    # Parse dates
    from_date = parse_date(from_date_str) if from_date_str else None
    to_date = parse_date(to_date_str) if to_date_str else None
    
    # Get invoices for this vendor
    invoices = PurchaseInvoice.objects.filter(vendor=vendor).order_by('-date')
    
    # Apply date filters if provided
    if from_date:
        invoices = invoices.filter(date__gte=from_date)
    if to_date:
        invoices = invoices.filter(date__lte=to_date)
    
    # Calculate totals
    total_purchases = sum(invoice.net_total for invoice in invoices)
    total_payments = sum(invoice.paid_amount for invoice in invoices)
    total_due = total_purchases - total_payments
    
    context = {
        'vendor': vendor,
        'invoices': invoices,
        'total_purchases': total_purchases,
        'total_payments': total_payments,
        'total_due': total_due,
        'from_date': from_date_str,
        'to_date': to_date_str,
    }
    
    return render(request, 'Accounts/vendor_invoice_detail.html', context)

def customer_invoice_detail(request, customer_id):
    customer = get_object_or_404(Customer, id=customer_id)
    
    # Get filter parameters
    from_date_str = request.GET.get('from_date')
    to_date_str = request.GET.get('to_date')
    
    # Parse dates
    from_date = parse_date(from_date_str) if from_date_str else None
    to_date = parse_date(to_date_str) if to_date_str else None
    
    # Get invoices for this customer - note in SalesInvoice, Customer is referenced as 'vendor'
    invoices = SalesInvoice.objects.filter(vendor=customer).order_by('-invoice_date')
    
    # Apply date filters if provided
    if from_date:
        invoices = invoices.filter(invoice_date__gte=from_date)
    if to_date:
        invoices = invoices.filter(invoice_date__lte=to_date)
    
    # Calculate totals using a more efficient approach
    total_sales = sum(invoice.net_total_after_packaging for invoice in invoices)
    total_payments = sum(invoice.paid_amount for invoice in invoices)
    total_due = total_sales - total_payments
    
    context = {
        'customer': customer,
        'invoices': invoices,
        'total_sales': total_sales,
        'total_payments': total_payments,
        'total_due': total_due,
        'from_date': from_date_str,
        'to_date': to_date_str,
    }
    
    return render(request, 'Accounts/customer_invoice_detail.html', context)