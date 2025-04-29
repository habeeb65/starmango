import pandas as pd
import os

# Read the CSV file with correct encoding
df = pd.read_csv('fixed_purchase_invoice.csv')

# Fix any data issues
# 1. Ensure net_total is numeric
df['net_total'] = pd.to_numeric(df['net_total'], errors='coerce')

# 2. Ensure dates are in correct format
df['date'] = pd.to_datetime(df['date'])

# 3. Make sure status is consistent
df['status'] = df['status'].fillna('available')

# 4. Make sure vendor_id is an integer
df['vendor_id'] = df['vendor_id'].astype(int)

# 5. Fix any missing values
df['status_notes'] = df['status_notes'].fillna('')

# Display info about the dataframe
print(f"Total records: {len(df)}")
print(f"Data types: \n{df.dtypes}")

# Save the cleaned CSV (with UTF-8 encoding and no BOM)
df.to_csv('cleaned_purchase_invoice.csv', index=False, encoding='utf-8')
print(f"Cleaned CSV saved to 'cleaned_purchase_invoice.csv'")

# Optional: Sample of the data
print("\nSample data:")
print(df.head()) 