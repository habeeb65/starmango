import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from django.db.models import Sum, Avg, Count, F, Q, ExpressionWrapper, DecimalField
from django.utils import timezone
from Accounts.models import PurchaseInvoice, PurchaseProduct, Payment, Product, PurchaseVendor
from io import BytesIO
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import xlsxwriter

class ReportGenerator:
    """Base class for report generation"""
    
    def __init__(self, tenant, start_date=None, end_date=None, **kwargs):
        self.tenant = tenant
        self.start_date = start_date or (timezone.now() - timedelta(days=30)).date()
        self.end_date = end_date or timezone.now().date()
        self.kwargs = kwargs
        self.data = None
    
    def generate_data(self):
        """Generate the report data - to be implemented by subclasses"""
        raise NotImplementedError("Subclasses must implement generate_data()")
    
    def to_pdf(self, output=None):
        """Generate PDF report"""
        if self.data is None:
            self.generate_data()
        
        buffer = output or BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []
        
        # Title
        title_style = styles['Heading1']
        title = Paragraph(f"{self.__class__.__name__.replace('Report', ' Report')}", title_style)
        elements.append(title)
        
        # Date range
        date_style = styles['Normal']
        date_range = Paragraph(f"Period: {self.start_date} to {self.end_date}", date_style)
        elements.append(date_range)
        elements.append(Spacer(1, 12))
        
        # Convert DataFrame to Table
        if isinstance(self.data, pd.DataFrame):
            data_list = [self.data.columns.tolist()] + self.data.values.tolist()
            table = Table(data_list)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.lightgreen),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ]))
            elements.append(table)
        
        # Build the PDF
        doc.build(elements)
        
        if output is None:
            buffer.seek(0)
            return buffer
    
    def to_excel(self, output=None):
        """Generate Excel report"""
        if self.data is None:
            self.generate_data()
        
        buffer = output or BytesIO()
        
        # Create Excel file
        with pd.ExcelWriter(buffer, engine='xlsxwriter') as writer:
            if isinstance(self.data, pd.DataFrame):
                self.data.to_excel(writer, sheet_name='Report', index=False)
                
                # Get the xlsxwriter workbook and worksheet objects
                workbook = writer.book
                worksheet = writer.sheets['Report']
                
                # Add a header format
                header_format = workbook.add_format({
                    'bold': True,
                    'text_wrap': True,
                    'valign': 'top',
                    'fg_color': '#D7E4BC',
                    'border': 1
                })
                
                # Write the column headers with the defined format
                for col_num, value in enumerate(self.data.columns.values):
                    worksheet.write(0, col_num, value, header_format)
                
                # Set column widths
                for i, col in enumerate(self.data.columns):
                    max_len = max(self.data[col].astype(str).map(len).max(), len(col)) + 2
                    worksheet.set_column(i, i, max_len)
        
        if output is None:
            buffer.seek(0)
            return buffer
    
    def to_csv(self, output=None):
        """Generate CSV report"""
        if self.data is None:
            self.generate_data()
        
        buffer = output or BytesIO()
        
        if isinstance(self.data, pd.DataFrame):
            self.data.to_csv(buffer, index=False)
        
        if output is None:
            buffer.seek(0)
            return buffer


class SalesReport(ReportGenerator):
    """Sales analysis report"""
    
    def generate_data(self):
        # This is a placeholder - in a real implementation, you would query your sales model
        # For now, we'll use purchase data as a stand-in
        
        purchases = PurchaseInvoice.objects.filter(
            tenant=self.tenant,
            date__gte=self.start_date,
            date__lte=self.end_date
        )
        
        # Create a DataFrame from the purchases
        data = []
        for purchase in purchases:
            data.append({
                'Date': purchase.date,
                'Invoice': purchase.invoice_number,
                'Vendor': purchase.vendor.name,
                'Total Amount': purchase.net_total,
                'Paid Amount': purchase.paid_amount,
                'Due Amount': purchase.due_amount
            })
        
        self.data = pd.DataFrame(data)
        
        # Add summary statistics
        if not self.data.empty:
            self.data = self.data.sort_values('Date')
            self.summary = {
                'Total Sales': self.data['Total Amount'].sum(),
                'Total Paid': self.data['Paid Amount'].sum(),
                'Total Due': self.data['Due Amount'].sum(),
                'Average Sale': self.data['Total Amount'].mean()
            }
        else:
            self.data = pd.DataFrame(columns=['Date', 'Invoice', 'Vendor', 'Total Amount', 'Paid Amount', 'Due Amount'])
            self.summary = {
                'Total Sales': 0,
                'Total Paid': 0,
                'Total Due': 0,
                'Average Sale': 0
            }
        
        return self.data


class InventoryReport(ReportGenerator):
    """Inventory status report"""
    
    def generate_data(self):
        # Get all products for this tenant
        products = Product.objects.filter(tenant=self.tenant)
        
        # Create a DataFrame for inventory status
        data = []
        for product in products:
            # Get all purchase products for this product
            purchase_products = PurchaseProduct.objects.filter(
                product=product,
                invoice__date__lte=self.end_date
            )
            
            total_purchased = purchase_products.aggregate(
                total=Sum('quantity')
            )['total'] or 0
            
            # In a real implementation, you would subtract sales
            # For now, we'll use a placeholder for available quantity
            available = total_purchased * 0.7  # Assuming 30% has been sold
            
            data.append({
                'Product': product.name,
                'Total Purchased': total_purchased,
                'Available Quantity': available,
                'Value': available * purchase_products.aggregate(avg=Avg('price'))['avg'] if purchase_products.exists() else 0
            })
        
        self.data = pd.DataFrame(data)
        
        # Add summary statistics
        if not self.data.empty:
            self.summary = {
                'Total Products': len(self.data),
                'Total Inventory Value': self.data['Value'].sum(),
                'Average Product Value': self.data['Value'].mean()
            }
        else:
            self.data = pd.DataFrame(columns=['Product', 'Total Purchased', 'Available Quantity', 'Value'])
            self.summary = {
                'Total Products': 0,
                'Total Inventory Value': 0,
                'Average Product Value': 0
            }
        
        return self.data


class PaymentsReport(ReportGenerator):
    """Payments analysis report"""
    
    def generate_data(self):
        # Get all payments for this tenant in the date range
        payments = Payment.objects.filter(
            invoice__tenant=self.tenant,
            date__gte=self.start_date,
            date__lte=self.end_date
        )
        
        # Create a DataFrame from the payments
        data = []
        for payment in payments:
            data.append({
                'Date': payment.date,
                'Invoice': payment.invoice.invoice_number,
                'Vendor': payment.invoice.vendor.name,
                'Amount': payment.amount,
                'Payment Mode': payment.get_payment_mode_display()
            })
        
        self.data = pd.DataFrame(data)
        
        # Add payment mode breakdown
        if not self.data.empty:
            self.data = self.data.sort_values('Date')
            payment_modes = self.data.groupby('Payment Mode')['Amount'].agg(['sum', 'count'])
            payment_modes.columns = ['Total Amount', 'Number of Payments']
            self.payment_modes = payment_modes.reset_index()
            
            self.summary = {
                'Total Payments': len(self.data),
                'Total Amount': self.data['Amount'].sum(),
                'Average Payment': self.data['Amount'].mean()
            }
        else:
            self.data = pd.DataFrame(columns=['Date', 'Invoice', 'Vendor', 'Amount', 'Payment Mode'])
            self.payment_modes = pd.DataFrame(columns=['Payment Mode', 'Total Amount', 'Number of Payments'])
            self.summary = {
                'Total Payments': 0,
                'Total Amount': 0,
                'Average Payment': 0
            }
        
        return self.data


class VendorReport(ReportGenerator):
    """Vendor analysis report"""
    
    def generate_data(self):
        # Get all vendors for this tenant
        vendors = PurchaseVendor.objects.filter(tenant=self.tenant)
        
        # Create a DataFrame for vendor analysis
        data = []
        for vendor in vendors:
            # Get all invoices for this vendor in the date range
            invoices = PurchaseInvoice.objects.filter(
                vendor=vendor,
                date__gte=self.start_date,
                date__lte=self.end_date
            )
            
            total_purchases = invoices.aggregate(total=Sum('net_total'))['total'] or 0
            total_paid = sum(invoice.paid_amount for invoice in invoices)
            total_due = sum(invoice.due_amount for invoice in invoices)
            
            data.append({
                'Vendor': vendor.name,
                'Area': vendor.area,
                'Contact': vendor.contact_number,
                'Total Purchases': total_purchases,
                'Total Paid': total_paid,
                'Total Due': total_due,
                'Number of Invoices': invoices.count()
            })
        
        self.data = pd.DataFrame(data)
        
        # Add summary statistics
        if not self.data.empty:
            self.summary = {
                'Total Vendors': len(self.data),
                'Total Purchase Value': self.data['Total Purchases'].sum(),
                'Total Due Amount': self.data['Total Due'].sum(),
                'Average Purchase per Vendor': self.data['Total Purchases'].mean()
            }
        else:
            self.data = pd.DataFrame(columns=[
                'Vendor', 'Area', 'Contact', 'Total Purchases', 
                'Total Paid', 'Total Due', 'Number of Invoices'
            ])
            self.summary = {
                'Total Vendors': 0,
                'Total Purchase Value': 0,
                'Total Due Amount': 0,
                'Average Purchase per Vendor': 0
            }
        
        return self.data