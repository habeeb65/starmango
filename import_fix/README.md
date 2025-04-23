# Purchase Invoice Import Fix

This folder contains fixed CSV files for importing purchase invoices that were previously causing errors.

## Files

1. `fixed_purchase_invoice.csv` - The original CSV data with consistent formatting
2. `cleaned_purchase_invoice.csv` - The processed CSV with proper data types and formatting
3. `import_invoice.py` - Python script that performs the data cleaning

## Issues Fixed

1. Consistent data types for all columns
2. Proper date formatting
3. Numeric values for net_total
4. Filled any missing values
5. Fixed inconsistent ID sequence
6. UTF-8 encoding without BOM

## How to Use

1. Use the `cleaned_purchase_invoice.csv` file for your import
2. Check that all 271 records are properly imported
3. Verify that all columns (id, invoice_number, lot_number, date, net_total, payment_issuer_name, vendor_id, status, status_notes) are correctly parsed

## Python Requirements

The script requires:
- Python 3.x
- pandas library 