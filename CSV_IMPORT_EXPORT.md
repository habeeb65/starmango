# CSV Import/Export for Star Mango

This document provides comprehensive instructions on using the CSV import and export functionality for Sales Invoices and Purchase Invoices in the Star Mango system.

## Overview

The system provides a robust way to:
- Import bulk data from CSV files
- Export filtered sets of records to CSV
- Validate data during import
- Handle errors gracefully

## CSV Format Requirements

### Sales Invoice CSV Format

The Sales Invoice CSV must include the following headers:

```
id,invoice_number,invoice_date,vehicle_number,gross_vehicle_weight,reference,no_of_crates,cost_per_crate,purchased_crates_quantity,purchased_crates_unit_price,vendor_id
```

Example row:
```
4,SA2025S01,2025-03-30,0,0.00,,775.00,24.00,125.00,40.00,1
```

#### Required Fields:
- **invoice_number**: Unique identifier for the invoice
- **invoice_date**: Date in YYYY-MM-DD format
- **vendor_id**: ID of an existing customer in the system

#### Optional Fields:
- **id**: Auto-generated for new records
- **vehicle_number**: Number plate of the vehicle
- **gross_vehicle_weight**: Weight in kg
- **reference**: Reference information
- **no_of_crates**: Number of crates
- **cost_per_crate**: Cost per crate
- **purchased_crates_quantity**: Quantity of purchased crates
- **purchased_crates_unit_price**: Unit price of purchased crates

### Purchase Invoice CSV Format

The Purchase Invoice CSV now supports product details and payment information with these headers:

```
id,invoice_number,lot_number,date,net_total,payment_issuer_name,vendor_id,status,status_notes,product_name,quantity,price,damage,discount,rotten,loading_unloading,paid_amount
```

Example multi-row import with products:
```
1,MS2025R226,LOT-226,2023-04-15,0,Abdul Rafi,2,available,,Mango Banganapalli,2000,50,20,2,30,5,10000
,,,,,,,,,,,,,,,,
,,,,,,,,,Mango Totapuri,1500,45,15,2,25,5,
,,,,,,,,,Mango Alphonso,500,120,5,0,10,5,
```

#### Required Fields for Invoice Header:
- **invoice_number**: Unique identifier for the invoice
- **lot_number**: Lot number
- **date**: Date in YYYY-MM-DD format
- **vendor_id**: ID of an existing vendor in the system

#### Required Fields for Products:
- **product_name**: Name of the product (will be created if it doesn't exist)

#### Optional Fields:
- **id**: Auto-generated for new records
- **net_total**: Total amount (will be calculated from products if not provided)
- **payment_issuer_name**: Name of the payment issuer
- **status**: Status of the invoice (e.g., "available")
- **status_notes**: Additional notes
- **quantity**: Product quantity in kg
- **price**: Price per kg
- **damage**: Damaged quantity in kg
- **discount**: Discount percentage
- **rotten**: Rotten quantity in kg
- **loading_unloading**: Loading/unloading cost
- **paid_amount**: Amount already paid (creates a payment record)

#### Format Notes:
- The first row should contain the invoice header information and optionally the first product
- Additional products for the same invoice can be added in subsequent rows
- For additional product rows, only fill in the product details fields
- Empty rows between products are optional but improve readability
- Vendors will be created automatically if they don't exist, using the payment_issuer_name as the vendor name

## Importing CSV Data

### Via Admin Interface

1. Log in to the admin interface
2. Navigate to Sales Invoices or Purchase Invoices
3. Click the "Import CSV" button at the top of the list
4. Select a CSV file that follows the format requirements
5. Click "Upload and Import"
6. Review the results message for success/errors

### Important Notes for Import

- The first row of your CSV must contain the headers as specified above
- Date fields must use the YYYY-MM-DD format
- Numeric values should use a period (.) as the decimal separator
- The vendor_id/customer_id will be created automatically if it doesn't exist
- If a record with the same invoice_number already exists, it will be updated instead of creating a new one
- The system validates all rows before importing and will report any errors

## Exporting to CSV

### Via Admin Interface

1. Log in to the admin interface
2. Navigate to Sales Invoices or Purchase Invoices
3. Use filters to narrow down the records you want to export (optional)
4. Select the records you want to export using the checkboxes
5. From the "Action" dropdown, select "Export selected records as CSV"
6. Click "Go"
7. Your browser will download the CSV file

### Export Format

The exported CSV will include all fields for the selected records, with the same headers as described in the import format.

## Error Handling

During import, the system validates each row and reports any errors. Common errors include:

- Missing required fields
- Invalid date formats
- Non-numeric values in numeric fields
- References to non-existent vendors/customers
- Duplicate invoice numbers (for new records)

If errors occur, the import process will skip the problematic rows and continue with the valid ones. The admin interface will display detailed error messages to help you correct the issues.

## Best Practices

1. Always back up your data before performing large imports
2. Start with a small test file to ensure your format is correct
3. Use Excel or another spreadsheet program to prepare your CSV, then export as CSV
4. Check that your CSV file is saved with UTF-8 encoding
5. For large imports, consider breaking them into smaller batches
6. Review error messages carefully to correct issues before retrying 