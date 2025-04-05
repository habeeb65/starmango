#!/usr/bin/env python

def fix_models_indentation():
    try:
        with open('Accounts/models.py', 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Fix the indentation error at line 118-123
        if "                if update_total and self.pk:" in lines[117]:
            lines[117] = "        if update_total and self.pk:\n"
        
        with open('Accounts/models.py', 'w', encoding='utf-8') as f:
            f.writelines(lines)
        
        print("Fixed indentation in models.py")
    except Exception as e:
        print(f"Error fixing models.py: {e}")

if __name__ == "__main__":
    fix_models_indentation()
