import csv
import os
from decimal import Decimal

# Input and output file paths
input_file = 'Accounts_salesinvoice (3).csv'  # Updated to match your actual file
output_file = 'Accounts_salesinvoice_with_products.csv'

# Define the new headers
new_headers = [
    'id', 'invoice_number', 'invoice_date', 'vehicle_number', 
    'gross_vehicle_weight', 'reference', 'no_of_crates', 
    'cost_per_crate', 'purchased_crates_quantity', 
    'purchased_crates_unit_price', 'vendor_id',
    'product_id', 'product_name', 'quantity', 'unit_price', 'discount'
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
            
        # Calculate appropriate product details based on crates information
        # This is just a placeholder, adjust according to your business logic
        no_of_crates = Decimal(row.get('no_of_crates', '0') or '0')
        cost_per_crate = Decimal(row.get('cost_per_crate', '0') or '0')
        
        # Use crate information to estimate product quantities and pricing
        product_quantity = no_of_crates * 20  # Assuming 20kg per crate
        
        # Add product details to the row
        product_row = row.copy()
        for field in new_headers:
            if field not in product_row:
                product_row[field] = ''
                
        # Add reference if missing
        if not product_row.get('reference') and product_row.get('invoice_number'):
            product_row['reference'] = f"Ref-{product_row['invoice_number']}"
                
        # Add product details (adjust as needed)
        product_row['product_id'] = '1'  # Default product ID, adjust as needed
        product_row['product_name'] = 'Mango'  # Default product name
        product_row['quantity'] = str(product_quantity)
        
        # Calculate unit price based on crates if available
        if no_of_crates > 0 and cost_per_crate > 0:
            total_cost = no_of_crates * cost_per_crate
            unit_price = total_cost / product_quantity if product_quantity > 0 else 0
            product_row['unit_price'] = str(unit_price)
        else:
            product_row['unit_price'] = '50'  # Default price
            
        product_row['discount'] = '0'  # Default discount
        
        # Write the product row
        writer.writerow(product_row)

print(f'Conversion complete. New file created: {output_file}')
print(f'Total rows processed: {sum(1 for line in open(input_file)) - 1}')
print(f'CSV converted successfully with product details.') 