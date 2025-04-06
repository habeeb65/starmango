def fix_file():
    with open('Accounts/models.py', 'r') as file:
        lines = file.readlines()
    
    # The issue is likely around line 587-589, check the indentation
    fixed_lines = []
    for i, line in enumerate(lines):
        if i == 587 and line.strip().startswith('elif self.quantity') and not lines[i+1].startswith('                '):
            # Found the issue - next line should be indented
            fixed_lines.append(line)
            # Fix the indentation of the next block
            if lines[i+1].strip().startswith('raise ValidationError'):
                fixed_lines.append('                ' + lines[i+1].lstrip())
            else:
                fixed_lines.append(lines[i+1])
        elif i == 588 and lines[i-1].strip().startswith('elif self.quantity'):
            # Skip this line as we've already handled it
            continue
        else:
            fixed_lines.append(line)
    
    with open('Accounts/models.py', 'w') as file:
        file.writelines(fixed_lines)
    
    print("File fixed!")

if __name__ == '__main__':
    fix_file() 