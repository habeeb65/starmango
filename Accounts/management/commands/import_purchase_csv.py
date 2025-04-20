import csv
import io
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db import transaction
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from Accounts.models import PurchaseInvoice, PurchaseVendor, Payment

class Command(BaseCommand):
    help = 'Imports purchase invoices from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        csv_file_path = options['csv_file']
        
        try:
            with open(csv_file_path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                header = next(reader, None)  # Skip header row
                
                if not header:
                    raise CommandError("CSV file is empty")
                
                # Check if the CSV matches the admin interface format
                admin_format = 'vendor_id' in header and 'invoice_number' in header
                
                if admin_format:
                    # Get column indices for admin format
                    col_indices = {
                        'id': header.index('id') if 'id' in header else None,
                        'invoice_number': header.index('invoice_number'),
                        'lot_number': header.index('lot_number'),
                        'date': header.index('date'),
                        'net_total': header.index('net_total'),
                        'payment_issuer_name': header.index('payment_issuer_name') if 'payment_issuer_name' in header else None,
                        'vendor_id': header.index('vendor_id'),
                        'status': header.index('status') if 'status' in header else None,
                    }
                else:
                    # Check if required headers are present for custom format
                    required_headers = ['invoice_number', 'lot_number', 'vendor_name', 'date', 'net_total']
                    missing_headers = [h for h in required_headers if h not in header]
                    
                    if missing_headers:
                        raise CommandError(f"CSV file is missing required headers: {', '.join(missing_headers)}")
                    
                    # Get column indices for custom format
                    col_indices = {
                        'invoice_number': header.index('invoice_number'),
                        'lot_number': header.index('lot_number'),
                        'vendor_name': header.index('vendor_name'),
                        'date': header.index('date'),
                        'net_total': header.index('net_total'),
                        'paid_amount': header.index('paid_amount') if 'paid_amount' in header else None,
                    }
                
                success_count = 0
                error_count = 0
                
                for i, row in enumerate(reader, start=1):
                    try:
                        with transaction.atomic():
                            # Extract fields from row
                            invoice_number = row[col_indices['invoice_number']]
                            lot_number = row[col_indices['lot_number']]
                            date_str = row[col_indices['date']]
                            
                            try:
                                net_total = float(row[col_indices['net_total']])
                            except (ValueError, IndexError):
                                net_total = 0
                                
                            # Get vendor by ID or name based on format
                            if admin_format:
                                try:
                                    vendor_id = int(row[col_indices['vendor_id']])
                                    try:
                                        vendor = PurchaseVendor.objects.get(id=vendor_id)
                                    except ObjectDoesNotExist:
                                        self.stderr.write(f"Row {i}: Vendor with ID {vendor_id} does not exist.")
                                        # Create vendor with ID and payment_issuer_name as the name
                                        payment_issuer_name = row[col_indices['payment_issuer_name']] if col_indices['payment_issuer_name'] is not None and len(row) > col_indices['payment_issuer_name'] else "Unknown"
                                        vendor = PurchaseVendor.objects.create(
                                            id=vendor_id,
                                            name=f"{payment_issuer_name} (Vendor {vendor_id})",
                                            contact_number="",
                                            area=""
                                        )
                                        self.stdout.write(f"Row {i}: Created vendor with ID {vendor_id} and name '{vendor.name}'")
                                except (ValueError, IndexError):
                                    self.stderr.write(f"Row {i}: Invalid vendor ID.")
                                    continue
                            else:
                                # Custom format with vendor_name
                                vendor_name = row[col_indices['vendor_name']]
                                vendor, created = PurchaseVendor.objects.get_or_create(name=vendor_name)
                                
                                if created:
                                    self.stdout.write(f"Row {i}: Created new vendor: {vendor_name}")
                            
                            # Parse date
                            try:
                                invoice_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                            except ValueError:
                                self.stderr.write(f"Row {i}: Invalid date format. Expected YYYY-MM-DD, got {date_str}")
                                continue
                            
                            # Check if invoice already exists
                            invoice_exists = PurchaseInvoice.objects.filter(invoice_number=invoice_number).exists()
                            
                            if invoice_exists:
                                # Update existing invoice
                                invoice = PurchaseInvoice.objects.get(invoice_number=invoice_number)
                                invoice.lot_number = lot_number
                                invoice.vendor = vendor
                                invoice.date = invoice_date
                                invoice.net_total = net_total
                                invoice.save()
                                
                                self.stdout.write(f"Row {i}: Updated invoice {invoice_number}")
                            else:
                                # Create new invoice with manual invoice and lot numbers
                                invoice = PurchaseInvoice(
                                    invoice_number=invoice_number,
                                    lot_number=lot_number,
                                    vendor=vendor,
                                    date=invoice_date,
                                    net_total=net_total
                                )
                                # Save without auto-generating invoice_number and lot_number
                                invoice.save(update_fields=['invoice_number', 'lot_number', 'vendor', 'date', 'net_total'])
                                
                                self.stdout.write(f"Row {i}: Created invoice {invoice_number}")
                            
                            # Add payment if provided (only for custom format)
                            if not admin_format and col_indices.get('paid_amount') is not None:
                                try:
                                    paid_amount = float(row[col_indices['paid_amount']]) if len(row) > col_indices['paid_amount'] and row[col_indices['paid_amount']] else 0
                                    if paid_amount > 0:
                                        Payment.objects.create(
                                            invoice=invoice,
                                            amount=paid_amount,
                                            date=timezone.now()
                                        )
                                        self.stdout.write(f"Row {i}: Added payment of {paid_amount} to invoice {invoice_number}")
                                except (ValueError, IndexError):
                                    self.stderr.write(f"Row {i}: Invalid paid amount format.")
                            
                            success_count += 1
                            
                    except Exception as e:
                        error_count += 1
                        self.stderr.write(f"Row {i}: Error - {str(e)}")
                
                # Show summary
                self.stdout.write(self.style.SUCCESS(f"Import completed: {success_count} invoices imported successfully, {error_count} errors"))
                
        except FileNotFoundError:
            raise CommandError(f"CSV file not found: {csv_file_path}")
        except Exception as e:
            raise CommandError(f"Error reading CSV file: {str(e)}") 