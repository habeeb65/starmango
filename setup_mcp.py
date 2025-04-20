#!/usr/bin/env python
import subprocess
import os
import sys
import json

def install_mcp():
    """Install MCP server dependencies"""
    print("Installing MCP server dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "mcp-server"], check=True)
    subprocess.run([sys.executable, "-m", "pip", "install", "django-indexer"], check=True)
    print("Dependencies installed successfully.")

def run_mcp():
    """Run MCP server"""
    print("Starting MCP server...")
    subprocess.run(["mcp", "start"])

def generate_mcp_config():
    """Generate MCP config if not exists"""
    if not os.path.exists("mcp.config.json"):
        config = {
            "include": [
                "Accounts/**/*.py",
                "Mango_project/**/*.py",
                "templates/**/*.html",
                "*.py"
            ],
            "exclude": [
                "**/venv/**",
                "**/migrations/**",
                "**/__pycache__/**",
                "**/node_modules/**",
                "**/.git/**"
            ],
            "indexing": {
                "maxTokens": 2000000,
                "tokensPerFile": 15000
            },
            "analysis": {
                "django": True,
                "model_files": ["Accounts/models.py"],
                "view_files": ["Accounts/views.py"],
                "template_dirs": ["templates/"]
            }
        }
        
        with open("mcp.config.json", "w") as f:
            json.dump(config, f, indent=2)
        print("Generated MCP configuration file.")

def index_project():
    """Index the project using MCP"""
    print("Indexing project files...")
    subprocess.run(["mcp", "index"])
    print("Project indexed successfully.")

if __name__ == "__main__":
    install_mcp()
    generate_mcp_config()
    index_project()
    run_mcp() 