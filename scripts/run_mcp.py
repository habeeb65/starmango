#!/usr/bin/env python

import os
import json
import subprocess
import sys
import signal
import time

def install_mcp():
    """Install MCP server dependencies."""
    print("Installing MCP server dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "mcp-server", "django-indexer"])

def generate_mcp_config():
    """Generate MCP server configuration file if it doesn't exist."""
    config_file = "mcp.config.json"
    
    if os.path.exists(config_file):
        print(f"Using existing configuration file: {config_file}")
        return
    
    print(f"Generating new configuration file: {config_file}")
    
    config = {
        "include": [
            "Accounts/**/*.py",
            "Mango_project/**/*.py",
            "templates/**/*.html"
        ],
        "exclude": [
            "**/.venv/**",
            "**/venv/**",
            "**/migrations/**",
            "**/__pycache__/**",
            "**/.git/**",
            "**/node_modules/**",
            "**/.pytest_cache/**"
        ],
        "indexing": {
            "max_tokens": 2000000,
            "max_tokens_per_file": 15000
        },
        "analysis": {
            "django": {
                "models": [
                    "Accounts/models.py"
                ],
                "views": [
                    "Accounts/views.py"
                ],
                "admin": [
                    "Accounts/admin.py"
                ],
                "templates": [
                    "templates/**/*.html"
                ],
                "settings": [
                    "Mango_project/settings.py"
                ]
            }
        }
    }
    
    with open(config_file, "w") as f:
        json.dump(config, f, indent=2)

def index_project():
    """Run the indexing process."""
    print("Indexing project...")
    subprocess.check_call(["mcp-server", "index"])

def run_mcp():
    """Run the MCP server."""
    print("Starting MCP server...")
    mcp_process = subprocess.Popen(["mcp-server", "run"])
    
    try:
        while mcp_process.poll() is None:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down MCP server...")
        mcp_process.send_signal(signal.SIGTERM)
        mcp_process.wait()

def main():
    try:
        install_mcp()
        generate_mcp_config()
        index_project()
        run_mcp()
    except Exception as e:
        print(f"Error: {e}")
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main()) 