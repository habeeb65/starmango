"""
Start development environment for StarMango.
This script starts both the Django backend and React frontend.
"""

import os
import platform
import subprocess
import sys
from pathlib import Path
import threading
import time

# Get the project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

def start_backend():
    """Start the Django backend"""
    print("Starting Django backend on http://localhost:8000")
    os.chdir(BASE_DIR)
    
    # Determine which Python executable to use
    python_exe = 'python'
    if platform.system() == 'Windows':
        # Check if we should use python or python3
        if os.path.exists(os.path.join(BASE_DIR, '.venv', 'Scripts', 'python.exe')):
            python_exe = os.path.join('.venv', 'Scripts', 'python.exe')
    else:
        # Unix - check if we should use python3
        if os.path.exists(os.path.join(BASE_DIR, '.venv', 'bin', 'python')):
            python_exe = os.path.join('.venv', 'bin', 'python')
    
    try:
        # Run the Django development server
        subprocess.call([python_exe, 'manage.py', 'runserver'])
    except KeyboardInterrupt:
        print("Backend server stopped")
    except Exception as e:
        print(f"Error starting backend: {e}")

def start_frontend():
    """Start the React frontend development server"""
    frontend_dir = os.path.join(BASE_DIR, 'frontend')
    
    # Wait a moment for the backend to start
    time.sleep(2)
    
    print("Starting React frontend on http://localhost:3000")
    os.chdir(frontend_dir)
    
    try:
        # Check if using npm or pnpm
        if os.path.exists(os.path.join(frontend_dir, 'pnpm-lock.yaml')):
            subprocess.call(['pnpm', 'dev'])
        else:
            subprocess.call(['npm', 'run', 'dev'])
    except KeyboardInterrupt:
        print("Frontend server stopped")
    except Exception as e:
        print(f"Error starting frontend: {e}")

if __name__ == "__main__":
    print("Starting StarMango development environment...")
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend)
    backend_thread.daemon = True
    backend_thread.start()
    
    # Start frontend in the main thread
    start_frontend()
    
    print("Development servers stopped")
