import csv
import io
from datetime import datetime
from decimal import Decimal
from django import forms
from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from django.urls import path

from .models import SalesInvoice, PurchaseInvoice, Customer, PurchaseVendor, SalesPayment, Payment


class CSVImportForm(forms.Form):
    """Base form for CSV imports with validation"""
    csv_file = forms.FileField(
        label='CSV File',
        help_text='Please upload a CSV file with the required headers.'
    )

    def clean_csv_file(self):
        csv_file = self.cleaned_data['csv_file']
        if not csv_file.name.endswith('.csv'):
            raise ValidationError('File must be a CSV document')
        return csv_file


class SalesInvoiceCSVImportForm(CSVImportForm):
    """Form for SalesInvoice CSV import with specific validations"""
    
    def clean_csv_file(self):
        csv_file = super().clean_csv_file()
        
        # Read first line to check headers
        csv_data = csv_file.read().decode('utf-8')
        csv_file.seek(0)  # Reset file pointer
        
        reader = csv.reader(io.StringIO(csv_data))
        headers = next(reader, None)
        
        required_headers = ['invoice_number', 'invoice_date', 'vendor_id']
        missing_headers = [h for h in required_headers if h not in headers]
        
        if missing_headers:
            raise ValidationError(f"CSV is missing required headers: {', '.join(missing_headers)}")
            
        return csv_file


class PurchaseInvoiceCSVImportForm(CSVImportForm):
    """Form for PurchaseInvoice CSV import with specific validations"""
    
    def clean_csv_file(self):
        csv_file = super().clean_csv_file()
        
        # Read first line to check headers
        csv_data = csv_file.read().decode('utf-8')
        csv_file.seek(0)  # Reset file pointer
        
        reader = csv.reader(io.StringIO(csv_data))
        headers = next(reader, None)
        
        required_headers = ['invoice_number', 'lot_number', 'date', 'vendor_id']
        missing_headers = [h for h in required_headers if h not in headers]
        
        if missing_headers:
            raise ValidationError(f"CSV is missing required headers: {', '.join(missing_headers)}")
            
        return csv_file


class SalesInvoiceCSVImporter:
    """Handles importing SalesInvoice data from CSV"""
    
    @staticmethod
    def get_field_mapping():
        """Returns a mapping of CSV headers to model fields"""
        return {
            'id': 'id',
            'invoice_number': 'invoice_number',
            'invoice_date': 'invoice_date',
            'vehicle_number': 'vehicle_number',
            'gross_vehicle_weight': 'gross_vehicle_weight',
            'reference': 'reference',
            'no_of_crates': 'no_of_crates',
            'cost_per_crate': 'cost_per_crate',
            'purchased_crates_quantity': 'purchased_crates_quantity',
            'purchased_crates_unit_price': 'purchased_crates_unit_price',
            'vendor_id': 'vendor_id',
        }
    
    @staticmethod
    def process_row(row, headers):
        """
        Process a single row from the CSV
        Returns a tuple: (data_dict, errors)
        """
        data = {}
        errors = []
        mapping = SalesInvoiceCSVImporter.get_field_mapping()
        
        # Process each field in the row
        for i, value in enumerate(row):
            if i >= len(headers):
                break
                
            field_name = headers[i]
            if field_name not in mapping:
                continue  # Skip unmapped fields
                
            model_field = mapping[field_name]
            
            # Special handling for different field types
            if field_name == 'invoice_number':
                if not value.strip():
                    errors.append("Invoice number cannot be empty")
                data[model_field] = value.strip()
                
            elif field_name == 'invoice_date':
                try:
                    date_value = datetime.strptime(value, '%Y-%m-%d').date() if value else timezone.now().date()
                    data[model_field] = date_value
                except ValueError:
                    errors.append(f"Invalid date format for {field_name}: {value}")
                    
            elif field_name == 'vendor_id':
                try:
                    vendor_id = int(value) if value else None
                    if vendor_id:
                        try:
                            Customer.objects.get(pk=vendor_id)
                            data[model_field] = vendor_id
                        except Customer.DoesNotExist:
                            errors.append(f"Customer with ID {vendor_id} does not exist")
                    else:
                        errors.append("Customer ID is required")
                except ValueError:
                    errors.append(f"Invalid customer ID: {value}")
                    
            elif field_name in ['gross_vehicle_weight', 'no_of_crates', 'cost_per_crate', 
                              'purchased_crates_quantity', 'purchased_crates_unit_price']:
                try:
                    decimal_value = Decimal(value) if value else Decimal('0')
                    data[model_field] = decimal_value
                except:
                    errors.append(f"Invalid number for {field_name}: {value}")
            else:
                # For text fields, just use the value as is
                data[model_field] = value.strip() if value else None
                
        return data, errors
    
    @staticmethod
    def import_data(csv_file):
        """
        Import data from a CSV file
        Returns a tuple: (success_count, error_count, error_messages)
        """
        csv_data = csv_file.read().decode('utf-8')
        reader = csv.reader(io.StringIO(csv_data))
        headers = [h.lower() for h in next(reader)]
        
        success_count = 0
        error_count = 0
        error_messages = []
        
        for i, row in enumerate(reader, start=1):
            if not any(cell.strip() for cell in row):
                continue  # Skip empty rows
                
            # Process the row data and check for errors
            data, row_errors = SalesInvoiceCSVImporter.process_row(row, headers)
            
            if row_errors:
                error_count += 1
                error_messages.append(f"Row {i}: {'; '.join(row_errors)}")
                continue
                
            # Check if the invoice already exists
            invoice_number = data.get('invoice_number')
            existing = SalesInvoice.objects.filter(invoice_number=invoice_number).first()
            
            try:
                with transaction.atomic():
                    if existing:
                        # Update existing invoice
                        vendor_id = data.pop('vendor_id')
                        for field, value in data.items():
                            if field != 'invoice_number' and hasattr(existing, field):
                                setattr(existing, field, value)
                        
                        existing.vendor = Customer.objects.get(pk=vendor_id)
                        existing.save()
                    else:
                        # Create new invoice
                        vendor_id = data.pop('vendor_id')
                        vendor = Customer.objects.get(pk=vendor_id)
                        
                        # Remove 'id' if present as it's auto-generated
                        if 'id' in data:
                            data.pop('id')
                            
                        # Create the invoice
                        SalesInvoice.objects.create(
                            vendor=vendor,
                            **data
                        )
                
                success_count += 1
            except Exception as e:
                error_count += 1
                error_messages.append(f"Row {i}: Error saving invoice - {str(e)}")
                
        return success_count, error_count, error_messages


class PurchaseInvoiceCSVImporter:
    """Handles importing PurchaseInvoice data from CSV"""
    
    @staticmethod
    def get_field_mapping():
        """Returns a mapping of CSV headers to model fields"""
        return {
            'id': 'id',
            'invoice_number': 'invoice_number',
            'lot_number': 'lot_number',
            'date': 'date',
            'net_total': 'net_total',
            'payment_issuer_name': 'payment_issuer_name',
            'vendor_id': 'vendor_id',
            'status': 'status',
            'status_notes': 'status_notes',
            'product_name': 'product_name',  # For product details
            'quantity': 'quantity',          # For product details
            'price': 'price',                # For product details
            'damage': 'damage',              # For product details
            'discount': 'discount',          # For product details
            'rotten': 'rotten',              # For product details
            'loading_unloading': 'loading_unloading', # For product details
            'paid_amount': 'paid_amount',    # For payment details
        }
    
    @staticmethod
    def process_row(row, headers):
        """
        Process a single row from the CSV
        Returns a tuple: (data_dict, errors, product_data, payment_data)
        """
        data = {}
        errors = []
        product_data = None
        payment_data = None
        mapping = PurchaseInvoiceCSVImporter.get_field_mapping()
        
        # Check if this is a product row (has product details)
        has_product = any(h in headers for h in ['product_name', 'quantity', 'price'])
        
        # Process each field in the row
        for i, value in enumerate(row):
            if i >= len(headers):
                break
                
            field_name = headers[i]
            if field_name not in mapping:
                continue  # Skip unmapped fields
                
            model_field = mapping[field_name]
            
            # Special handling for different field types
            if field_name == 'invoice_number':
                if not value.strip():
                    errors.append("Invoice number cannot be empty")
                data[model_field] = value.strip()
                
            elif field_name == 'lot_number':
                if not value.strip():
                    errors.append("Lot number cannot be empty")
                data[model_field] = value.strip()
                
            elif field_name == 'date':
                try:
                    date_value = datetime.strptime(value, '%Y-%m-%d').date() if value else timezone.now().date()
                    data[model_field] = date_value
                except ValueError:
                    errors.append(f"Invalid date format for {field_name}: {value}")
                    
            elif field_name == 'vendor_id':
                try:
                    vendor_id = int(value) if value else None
                    if vendor_id:
                        try:
                            PurchaseVendor.objects.get(pk=vendor_id)
                            data[model_field] = vendor_id
                        except PurchaseVendor.DoesNotExist:
                            # Create vendor if it doesn't exist
                            payment_issuer_name = row[headers.index('payment_issuer_name')] if 'payment_issuer_name' in headers else f"Vendor {vendor_id}"
                            PurchaseVendor.objects.create(
                                id=vendor_id,
                                name=payment_issuer_name,
                                contact_number="",
                                area=""
                            )
                            data[model_field] = vendor_id
                    else:
                        errors.append("Vendor ID is required")
                except ValueError:
                    errors.append(f"Invalid vendor ID: {value}")
                    
            elif field_name in ['net_total', 'price', 'quantity', 'damage', 'discount', 'rotten', 'loading_unloading', 'paid_amount']:
                try:
                    decimal_value = Decimal(value) if value and value.strip() else Decimal('0')
                    if field_name == 'net_total':
                        data[model_field] = decimal_value
                    elif field_name == 'paid_amount':
                        # Store payment data separately
                        if decimal_value > 0:
                            payment_data = {
                                'amount': decimal_value,
                                'date': data.get('date', timezone.now().date()),
                                'payment_mode': 'cash'
                            }
                    elif has_product:
                        # Store product data separately
                        if product_data is None:
                            product_data = {}
                        product_data[field_name] = decimal_value
                except:
                    errors.append(f"Invalid number for {field_name}: {value}")
            
            elif field_name == 'product_name' and value.strip():
                # Product row
                if product_data is None:
                    product_data = {}
                product_data['product_name'] = value.strip()
            else:
                # For text fields, just use the value as is
                data[model_field] = value.strip() if value else None
                
        return data, errors, product_data, payment_data
    
    @staticmethod
    def import_data(csv_file):
        """
        Import data from a CSV file
        Returns a tuple: (success_count, error_count, error_messages)
        """
        from Accounts.models import Product, PurchaseProduct
        
        csv_data = csv_file.read().decode('utf-8')
        reader = csv.reader(io.StringIO(csv_data))
        headers = [h.lower() for h in next(reader)]
        
        success_count = 0
        error_count = 0
        error_messages = []
        
        # Track current invoice to handle multi-row product entries
        current_invoice = None
        
        for i, row in enumerate(reader, start=1):
            if not any(cell.strip() for cell in row):
                continue  # Skip empty rows
                
            # Process the row data and check for errors
            data, row_errors, product_data, payment_data = PurchaseInvoiceCSVImporter.process_row(row, headers)
            
            if row_errors:
                error_count += 1
                error_messages.append(f"Row {i}: {'; '.join(row_errors)}")
                continue
            
            # Determine if this is a new invoice or a product row for existing invoice
            if 'invoice_number' in data and data['invoice_number']:
                # This is a new invoice row
                invoice_number = data['invoice_number']
                
                try:
                    with transaction.atomic():
                        # Check if invoice exists
                        existing = PurchaseInvoice.objects.filter(invoice_number=invoice_number).first()
                        
                        if existing:
                            # Update existing invoice
                            vendor_id = data.pop('vendor_id')
                            for field, value in data.items():
                                if field != 'invoice_number' and hasattr(existing, field):
                                    setattr(existing, field, value)
                            
                            existing.vendor = PurchaseVendor.objects.get(pk=vendor_id)
                            existing.save()
                            current_invoice = existing
                        else:
                            # Create new invoice
                            vendor_id = data.pop('vendor_id')
                            vendor = PurchaseVendor.objects.get(pk=vendor_id)
                            
                            # Remove 'id' if present as it's auto-generated
                            if 'id' in data:
                                data.pop('id')
                                
                            # Create the invoice with manual invoice and lot numbers
                            invoice = PurchaseInvoice(
                                vendor=vendor,
                                **data
                            )
                            invoice.save(update_fields=list(data.keys()) + ['vendor'])
                            current_invoice = invoice
                        
                        # Add product if product data is present
                        if product_data and 'product_name' in product_data and current_invoice:
                            with transaction.atomic():
                                # Find or create product
                                product_name = product_data['product_name']
                                product, _ = Product.objects.get_or_create(name=product_name)
                                
                                # Get the values with defaults
                                quantity = product_data.get('quantity', Decimal('0'))
                                price = product_data.get('price', Decimal('0'))
                                damage = product_data.get('damage', Decimal('0'))
                                discount = product_data.get('discount', Decimal('0'))
                                rotten = product_data.get('rotten', Decimal('0'))
                                loading_unloading = product_data.get('loading_unloading', Decimal('0'))
                                
                                # Create the product entry
                                PurchaseProduct.objects.create(
                                    invoice=current_invoice,
                                    product=product,
                                    quantity=quantity,
                                    price=price,
                                    damage=damage,
                                    discount=discount,
                                    rotten=rotten,
                                    loading_unloading=loading_unloading,
                                )
                                
                                # Refresh the invoice to update calculated fields
                                current_invoice.refresh_from_db()
                        
                        # Add payment if payment data is present
                        if payment_data and current_invoice:
                            with transaction.atomic():
                                Payment.objects.create(
                                    invoice=current_invoice,
                                    amount=payment_data['amount'],
                                    date=payment_data['date'],
                                    payment_mode=payment_data['payment_mode']
                                )
                        
                        success_count += 1
                except Exception as e:
                    error_count += 1
                    error_messages.append(f"Row {i}: Error saving invoice - {str(e)}")
            
            # If this is only a product row without invoice number
            elif product_data and 'product_name' in product_data and current_invoice:
                try:
                    with transaction.atomic():
                        # Find or create product
                        product_name = product_data['product_name']
                        product, _ = Product.objects.get_or_create(name=product_name)
                        
                        # Get the values with defaults
                        quantity = product_data.get('quantity', Decimal('0'))
                        price = product_data.get('price', Decimal('0'))
                        damage = product_data.get('damage', Decimal('0'))
                        discount = product_data.get('discount', Decimal('0'))
                        rotten = product_data.get('rotten', Decimal('0'))
                        loading_unloading = product_data.get('loading_unloading', Decimal('0'))
                        
                        # Create the product entry
                        PurchaseProduct.objects.create(
                            invoice=current_invoice,
                            product=product,
                            quantity=quantity,
                            price=price,
                            damage=damage,
                            discount=discount,
                            rotten=rotten,
                            loading_unloading=loading_unloading,
                        )
                        
                        # Refresh the invoice to update calculated fields
                        current_invoice.refresh_from_db()
                        
                        success_count += 1
                except Exception as e:
                    error_count += 1
                    error_messages.append(f"Row {i}: Error adding product - {str(e)}")
                
        return success_count, error_count, error_messages


class CSVExporter:
    """Base class for exporting model data to CSV"""
    
    @staticmethod
    def export_queryset(queryset, field_names, header_names=None):
        """
        Export a queryset to CSV
        Returns an HttpResponse with CSV content
        """
        response = HttpResponse(content_type='text/csv')
        timestamp = timezone.now().strftime('%Y-%m-%d_%H-%M-%S')
        
        # Use the model name for the filename
        model_name = queryset.model._meta.model_name
        response['Content-Disposition'] = f'attachment; filename="{model_name}_{timestamp}.csv"'
        
        writer = csv.writer(response)
        
        # Write header row
        headers = header_names or field_names
        writer.writerow(headers)
        
        # Write data rows
        for obj in queryset:
            row = []
            for field in field_names:
                if field == 'vendor_id' and hasattr(obj, 'vendor'):
                    row.append(obj.vendor.id)
                elif field == 'vendor':
                    row.append(obj.vendor.name if obj.vendor else '')
                elif hasattr(obj, field):
                    value = getattr(obj, field)
                    # Format dates
                    if isinstance(value, datetime) or hasattr(value, 'strftime'):
                        value = value.strftime('%Y-%m-%d')
                    row.append(value)
                else:
                    row.append('')
            writer.writerow(row)
            
        return response


class SalesInvoiceCSVExporter(CSVExporter):
    """Handles exporting SalesInvoice data to CSV"""
    
    @staticmethod
    def export_queryset(queryset):
        """Export a SalesInvoice queryset to CSV"""
        field_names = [
            'id', 'invoice_number', 'invoice_date', 'vehicle_number', 
            'gross_vehicle_weight', 'reference', 'no_of_crates', 
            'cost_per_crate', 'purchased_crates_quantity', 
            'purchased_crates_unit_price', 'vendor_id'
        ]
        
        header_names = [
            'ID', 'Invoice Number', 'Invoice Date', 'Vehicle Number',
            'Gross Vehicle Weight', 'Reference', 'No. of Crates',
            'Cost per Crate', 'Purchased Crates Quantity',
            'Purchased Crates Unit Price', 'Customer ID'
        ]
        
        return CSVExporter.export_queryset(queryset, field_names, header_names)


class PurchaseInvoiceCSVExporter(CSVExporter):
    """Handles exporting PurchaseInvoice data to CSV"""
    
    @staticmethod
    def export_queryset(queryset):
        """Export a PurchaseInvoice queryset to CSV"""
        field_names = [
            'id', 'invoice_number', 'lot_number', 'date', 'net_total',
            'payment_issuer_name', 'vendor_id', 'status', 'status_notes'
        ]
        
        header_names = [
            'ID', 'Invoice Number', 'Lot Number', 'Date', 'Net Total',
            'Payment Issuer Name', 'Vendor ID', 'Status', 'Status Notes'
        ]
        
        return CSVExporter.export_queryset(queryset, field_names, header_names)


# Create mixins to add CSV import/export functionality to admin classes
class CSVImportExportMixin:
    """Mixin to add CSV import/export functionality to Django admin classes"""
    
    change_list_template = 'admin/custom_change_list.html'
    csv_import_form_class = CSVImportForm
    csv_importer_class = None
    csv_exporter_class = None
    
    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('import-csv/', self.admin_site.admin_view(self.import_csv), name=f'{self.model._meta.app_label}_{self.model._meta.model_name}_import_csv'),
        ]
        return my_urls + urls
    
    def changelist_view(self, request, extra_context=None):
        """Add import button to changelist view"""
        extra_context = extra_context or {}
        info = self.model._meta.app_label, self.model._meta.model_name
        extra_context['import_url'] = f'admin:{info[0]}_{info[1]}_import_csv'
        
        # Check if the user has permission to import
        extra_context['has_import_permission'] = self.has_import_permission(request)
        
        return super().changelist_view(request, extra_context)
    
    def has_import_permission(self, request):
        """Override this method to control import permissions"""
        return request.user.is_staff
    
    def import_csv(self, request):
        """View for importing CSV data"""
        if request.method == 'POST':
            form = self.csv_import_form_class(request.POST, request.FILES)
            if form.is_valid():
                csv_file = request.FILES['csv_file']
                
                # Use the importer class to process the CSV data
                success_count, error_count, error_messages = self.csv_importer_class.import_data(csv_file)
                
                # Show results
                if success_count:
                    self.message_user(request, f"Successfully imported {success_count} records", messages.SUCCESS)
                if error_count:
                    self.message_user(request, f"Failed to import {error_count} records", messages.ERROR)
                    for msg in error_messages[:10]:  # Show first 10 errors
                        self.message_user(request, msg, messages.ERROR)
                    if len(error_messages) > 10:
                        self.message_user(request, f"... and {len(error_messages) - 10} more errors", messages.ERROR)
                
                return redirect(f'admin:{self.model._meta.app_label}_{self.model._meta.model_name}_changelist')
        else:
            form = self.csv_import_form_class()
        
        # Render the import form
        context = {
            'title': f'Import {self.model._meta.verbose_name_plural} from CSV',
            'form': form,
            'opts': self.model._meta,
            'has_permission': self.has_import_permission(request),
            'site_title': self.admin_site.site_title,
            'site_header': self.admin_site.site_header,
        }
        
        return render(request, 'admin/csv_import.html', context)
    
    def export_as_csv(self, request, queryset):
        """Admin action to export selected records as CSV"""
        if not queryset:
            self.message_user(request, "No records selected for export", level=messages.WARNING)
            return None
        
        # Use the exporter class to generate the CSV response
        return self.csv_exporter_class.export_queryset(queryset)
    
    export_as_csv.short_description = "Export selected records as CSV"


# Create specific mixins for SalesInvoice and PurchaseInvoice
class SalesInvoiceCSVMixin(CSVImportExportMixin):
    """CSV import/export mixin specifically for SalesInvoice model"""
    csv_import_form_class = SalesInvoiceCSVImportForm
    csv_importer_class = SalesInvoiceCSVImporter
    csv_exporter_class = SalesInvoiceCSVExporter


class PurchaseInvoiceCSVMixin(CSVImportExportMixin):
    """CSV import/export mixin specifically for PurchaseInvoice model"""
    csv_import_form_class = PurchaseInvoiceCSVImportForm
    csv_importer_class = PurchaseInvoiceCSVImporter
    csv_exporter_class = PurchaseInvoiceCSVExporter 