import csv
import io
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db import transaction
from django.core.exceptions import ValidationError
from Accounts.models import SalesInvoice, Customer, SalesPayment

class Command(BaseCommand):
    help = 'Imports sales invoices from a CSV file'

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
                
                # Check if required headers are present
                required_headers = ['invoice_number', 'customer_name', 'invoice_date', 'net_total']
                missing_headers = [h for h in required_headers if h not in header]
                
                if missing_headers:
                    raise CommandError(f"CSV file is missing required headers: {', '.join(missing_headers)}")
                
                # Get column indices
                col_indices = {
                    'invoice_number': header.index('invoice_number'),
                    'customer_name': header.index('customer_name'),
                    'invoice_date': header.index('invoice_date'),
                    'net_total': header.index('net_total'),
                    'vehicle_number': header.index('vehicle_number') if 'vehicle_number' in header else None,
                    'gross_vehicle_weight': header.index('gross_vehicle_weight') if 'gross_vehicle_weight' in header else None,
                    'reference': header.index('reference') if 'reference' in header else None,
                    'paid_amount': header.index('paid_amount') if 'paid_amount' in header else None,
                }
                
                success_count = 0
                error_count = 0
                
                for i, row in enumerate(reader, start=1):
                    try:
                        with transaction.atomic():
                            # Extract fields from row
                            invoice_number = row[col_indices['invoice_number']]
                            customer_name = row[col_indices['customer_name']]
                            date_str = row[col_indices['invoice_date']]
                            net_total = float(row[col_indices['net_total']])
                            
                            # Optional fields
                            vehicle_number = row[col_indices['vehicle_number']] if col_indices['vehicle_number'] is not None and len(row) > col_indices['vehicle_number'] else None
                            gross_vehicle_weight = float(row[col_indices['gross_vehicle_weight']]) if col_indices['gross_vehicle_weight'] is not None and len(row) > col_indices['gross_vehicle_weight'] and row[col_indices['gross_vehicle_weight']] else None
                            reference = row[col_indices['reference']] if col_indices['reference'] is not None and len(row) > col_indices['reference'] else None
                            paid_amount = float(row[col_indices['paid_amount']]) if col_indices['paid_amount'] is not None and len(row) > col_indices['paid_amount'] and row[col_indices['paid_amount']] else 0
                            
                            # Get or create customer
                            customer, created = Customer.objects.get_or_create(name=customer_name)
                            
                            # Parse date
                            invoice_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                            
                            # Check if invoice already exists
                            invoice_exists = SalesInvoice.objects.filter(invoice_number=invoice_number).exists()
                            
                            if invoice_exists:
                                # Update existing invoice
                                invoice = SalesInvoice.objects.get(invoice_number=invoice_number)
                                invoice.vendor = customer
                                invoice.invoice_date = invoice_date
                                invoice.vehicle_number = vehicle_number
                                invoice.gross_vehicle_weight = gross_vehicle_weight
                                invoice.reference = reference
                                invoice.save()
                                
                                self.stdout.write(f"Row {i}: Updated invoice {invoice_number}")
                            else:
                                # Create new invoice
                                invoice = SalesInvoice.objects.create(
                                    invoice_number=invoice_number,
                                    vendor=customer,
                                    invoice_date=invoice_date,
                                    vehicle_number=vehicle_number,
                                    gross_vehicle_weight=gross_vehicle_weight,
                                    reference=reference
                                )
                                
                                self.stdout.write(f"Row {i}: Created invoice {invoice_number}")
                            
                            # Add payment if provided
                            if paid_amount > 0:
                                SalesPayment.objects.create(
                                    invoice=invoice,
                                    amount=paid_amount,
                                    date=timezone.now()
                                )
                                self.stdout.write(f"Row {i}: Added payment of {paid_amount} to invoice {invoice_number}")
                            
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