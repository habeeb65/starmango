# Star Mango - CSV Import Tools

This document provides instructions on how to use the CSV import tools for Star Mango.

## CSV Format

### Sales Invoices CSV Format

The sales invoices CSV file should have the following columns:

```
invoice_number,customer_name,invoice_date,net_total,vehicle_number,gross_vehicle_weight,reference,paid_amount
```

Example:
```
invoice_number,customer_name,invoice_date,net_total,vehicle_number,gross_vehicle_weight,reference,paid_amount
SA2025S03,John Doe,2023-06-15,5000.00,KA-01-AB-1234,1200.00,Order #12345,2500.00
SA2025S04,Jane Smith,2023-06-16,7500.00,KA-02-CD-5678,1450.00,Order #67890,7500.00
```

Required fields:
- `invoice_number`: Unique identifier for the sales invoice
- `customer_name`: Name of the customer
- `invoice_date`: Date of the invoice in YYYY-MM-DD format
- `net_total`: Net total amount of the invoice

Optional fields:
- `vehicle_number`: Vehicle number
- `gross_vehicle_weight`: Gross vehicle weight in kilograms
- `reference`: Reference information
- `paid_amount`: Amount already paid for this invoice

### Purchase Invoices CSV Format

The purchase invoices CSV file can be in one of two formats:

#### Admin Interface Format (Recommended)

```
id,invoice_number,lot_number,date,net_total,payment_issuer_name,vendor_id,status,status_notes
```

Example:
```
id,invoice_number,lot_number,date,net_total,payment_issuer_name,vendor_id,status,status_notes
1,MS2025R10,LOT-10,2023-06-15,15000.00,Abdul Rafi,2,available,
2,MS2025R11,LOT-11,2023-06-16,22500.00,Abdul Rafi,3,available,
```

Required fields:
- `invoice_number`: Unique identifier for the purchase invoice
- `lot_number`: Lot number for the purchase
- `date`: Date of the invoice in YYYY-MM-DD format
- `net_total`: Net total amount of the invoice
- `vendor_id`: ID of the vendor

Optional fields:
- `id`: Numeric identifier (auto-incremented)
- `payment_issuer_name`: Name of the payment issuer
- `status`: Status of the invoice (e.g., "available")
- `status_notes`: Additional notes about the status

#### Simplified Format (Alternative)

```
invoice_number,lot_number,vendor_name,date,net_total,paid_amount
```

Example:
```
invoice_number,lot_number,vendor_name,date,net_total,paid_amount
MS2025R10,LOT-10,Farmer Kumar,2023-06-15,15000.00,10000.00
MS2025R11,LOT-11,Farmer Singh,2023-06-16,22500.00,22500.00
```

Required fields:
- `invoice_number`: Unique identifier for the purchase invoice
- `lot_number`: Lot number for the purchase
- `vendor_name`: Name of the vendor
- `date`: Date of the invoice in YYYY-MM-DD format
- `net_total`: Net total amount of the invoice

Optional fields:
- `paid_amount`: Amount already paid for this invoice

## How to Use

1. Prepare your CSV file according to the format described above.
2. Save the CSV file in the root directory of the project.
3. Run the appropriate import script:
   - For sales invoices: Double-click on `import_sales_invoices.bat`
   - For purchase invoices: Double-click on `import_purchase_invoices.bat`
4. Check the output for success or error messages.

## Notes

- If an invoice with the same `invoice_number` already exists, it will be updated instead of creating a new one.
- For new sales invoices, a customer will be created if one with the same name doesn't exist already.
- For new purchase invoices, a vendor will be created if one with the same name doesn't exist already.
- If a `paid_amount` is provided, a payment record will be created for the invoice.
- All dates must be in YYYY-MM-DD format.
- All monetary values must use a period (.) as the decimal separator.
- The import script will automatically detect which format you're using for purchase invoices.

## Troubleshooting

If you encounter issues during import:

1. Check that your CSV file follows the correct format.
2. Ensure all required fields are present.
3. Make sure date values use the YYYY-MM-DD format.
4. Verify that numeric values use a period (.) as the decimal separator.
5. Check that the CSV file is saved with UTF-8 encoding.
6. For the vendor_id field, make sure the vendor exists in the database or use the simplified format with vendor_name instead.

For technical support, please contact your administrator. 