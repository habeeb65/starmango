import os
import shutil

# Make sure the directory exists
os.makedirs('staticfiles/admin/js', exist_ok=True)

# Copy the file from static to staticfiles
source_file = 'static/admin/js/vendor_popup_manager.js'
destination_file = 'staticfiles/admin/js/vendor_popup_manager.js'

try:
    shutil.copy2(source_file, destination_file)
    print(f"Successfully copied {source_file} to {destination_file}")
except Exception as e:
    print(f"Error copying file: {e}")

# Also create a symbolic link for the add_vendor_popup.js
link_destination = 'staticfiles/admin/js/add_vendor_popup.js'
try:
    # Create a copy with a different name (for backward compatibility)
    shutil.copy2(source_file, link_destination)
    print(f"Successfully copied {source_file} to {link_destination}")
except Exception as e:
    print(f"Error creating link: {e}")