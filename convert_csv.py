import csv
import os
from decimal import Decimal

# Input and output file paths
input_file = 'Accounts_purchaseinvoice (2).csv'
output_file = 'Accounts_purchaseinvoice_with_products.csv'

# Define the new headers
new_headers = [
    'id', 'invoice_number', 'lot_number', 'date', 'net_total', 
    'payment_issuer_name', 'vendor_id', 'status', 'status_notes',
    'product_name', 'quantity', 'price', 'damage', 'discount', 
    'rotten', 'loading_unloading', 'paid_amount'
]

# Open files
with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.DictReader(infile)
    writer = csv.DictWriter(outfile, fieldnames=new_headers)
    
    # Write header
    writer.writeheader()
    
    # Process each row
    for row in reader:
        # Skip empty rows
        if not any(row.values()):
            continue
            
        # Calculate appropriate product details based on net_total
        net_total = Decimal(row.get('net_total', '0') or '0')
        
        # Create reasonable defaults for quantity and price
        if net_total > 0:
            # Use 50 as a reasonable average price per kg
            avg_price = 50
            quantity = round(net_total / avg_price)
            
            # If net_total is very small, ensure minimum quantity
            if quantity < 10:
                quantity = 10
                avg_price = float(net_total) / quantity if quantity > 0 else 0
                
            # Set some damage/discount values to make it realistic
            damage = round(quantity * 0.01)  # 1% damage
            discount = 2  # 2% discount
            rotten = round(quantity * 0.015)  # 1.5% rotten
            loading = round(quantity * 0.1)  # 10 per 100kg for loading
        else:
            quantity = 0
            avg_price = 0
            damage = 0
            discount = 0
            rotten = 0
            loading = 0
        
        # Add product details to the row
        product_row = row.copy()
        for field in new_headers:
            if field not in product_row:
                product_row[field] = ''
                
        product_row['product_name'] = 'Mango'  # Default product
        product_row['quantity'] = str(quantity)
        product_row['price'] = str(avg_price)
        product_row['damage'] = str(damage)
        product_row['discount'] = str(discount)
        product_row['rotten'] = str(rotten)
        product_row['loading_unloading'] = str(loading)
        
        # Add 80% of net_total as paid amount for realistic payments
        if net_total > 0:
            paid_amount = net_total * Decimal('0.8')
            product_row['paid_amount'] = str(paid_amount)
        
        # Write the product row
        writer.writerow(product_row)

print(f'Conversion complete. New file created: {output_file}')
print(f'Total rows processed: {sum(1 for line in open(input_file)) - 1}')
print(f'CSV converted successfully with product details and payment information.') 