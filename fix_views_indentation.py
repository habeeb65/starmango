#!/usr/bin/env python

def fix_views_indentation():
    try:
        with open('Accounts/views.py', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix the first indentation error
        fixed_content = content.replace(
            "    if not hide_payments:\n    # Paid Amounts Section\n    paid_data",
            "    if not hide_payments:\n        # Paid Amounts Section\n        paid_data"
        )
        
        # Fix the second indentation error
        fixed_content = fixed_content.replace(
            "    if not hide_payments:\n    paid_and_payment_table",
            "    if not hide_payments:\n        paid_and_payment_table"
        )
        
        with open('Accounts/views.py', 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print("Fixed indentation in views.py")
    except Exception as e:
        print(f"Error fixing views.py: {e}")

if __name__ == "__main__":
    fix_views_indentation()
