#!/usr/bin/env python

def fix_models_indentation():
    try:
        with open('Accounts/models.py', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix the indentation error at line 118-124
        fixed_content = content.replace(
            "        # Update net_total if needed (not during a field-specific update that includes net_total)\n        if update_total and self.pk:\n        calculated_total = sum(product.total for product in self.purchase_products.all())\n        if self.net_total != calculated_total:\n            self.net_total = calculated_total\n                # Update only the net_total field without triggering full save again\n                type(self).objects.filter(pk=self.pk).update(net_total=calculated_total)",
            "        # Update net_total if needed (not during a field-specific update that includes net_total)\n        if update_total and self.pk:\n            calculated_total = sum(product.total for product in self.purchase_products.all())\n            if self.net_total != calculated_total:\n                self.net_total = calculated_total\n                # Update only the net_total field without triggering full save again\n                type(self).objects.filter(pk=self.pk).update(net_total=calculated_total)"
        )
        
        with open('Accounts/models.py', 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print("Fixed indentation in models.py")
    except Exception as e:
        print(f"Error fixing models.py: {e}")

if __name__ == "__main__":
    fix_models_indentation()
