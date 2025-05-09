"""
Build and deploy frontend to Django static directory.
This script:
1. Builds the React frontend
2. Copies the built files to Django's static/frontend directory
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

# Get the project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

def build_frontend():
    """Build the React frontend using npm/pnpm"""
    frontend_dir = os.path.join(BASE_DIR, 'frontend')
    static_dir = os.path.join(BASE_DIR, 'static', 'frontend')
    
    print("Building frontend...")
    
    try:
        # Change to frontend directory
        os.chdir(frontend_dir)
        
        # Run the build command
        if os.path.exists(os.path.join(frontend_dir, 'pnpm-lock.yaml')):
            subprocess.check_call(['pnpm', 'build'])
        else:
            subprocess.check_call(['npm', 'run', 'build'])
        
        # Ensure the static directory exists
        os.makedirs(static_dir, exist_ok=True)
        
        # Clean any old files
        for item in os.listdir(static_dir):
            item_path = os.path.join(static_dir, item)
            if os.path.isdir(item_path):
                shutil.rmtree(item_path)
            else:
                os.unlink(item_path)
        
        # Copy the built files to the static directory
        build_dir = os.path.join(frontend_dir, 'dist')
        if not os.path.exists(build_dir):
            print("Error: Build directory does not exist. Build might have failed.")
            return False
        
        # Copy all files from the build directory to the static directory
        for item in os.listdir(build_dir):
            src = os.path.join(build_dir, item)
            dst = os.path.join(static_dir, item)
            if os.path.isdir(src):
                shutil.copytree(src, dst)
            else:
                shutil.copy2(src, dst)
        
        print(f"Frontend built and copied to {static_dir}")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"Error building frontend: {e}")
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = build_frontend()
    sys.exit(0 if success else 1)
