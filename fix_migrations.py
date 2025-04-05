import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Mango_project.settings')
django.setup()

from django.db import connection

print("Fixing migration issues...")

try:
    with connection.cursor() as cursor:
        # Remove all reference to rename_date migrations
        cursor.execute("DELETE FROM django_migrations WHERE app = 'Accounts' AND name = 'rename_date_to_invoice_date'")
        print("Removed rename_date_to_invoice_date migration references")

        # Fix duplicate migrations
        cursor.execute("DELETE FROM django_migrations WHERE app = 'Accounts' AND name = '0006_salesinvoice_purchased_crates_quantity_and_more'")
        print("Removed duplicate migration entries")

    print("Migration cleanup completed successfully.")
except Exception as e:
    print(f"Error: {e}") 