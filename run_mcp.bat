@echo off
echo === MCP Server Setup and Launch ===

:: Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in PATH. Please install Python first.
    exit /b 1
)

:: Install MCP dependencies
echo Installing MCP server dependencies...
python -m pip install mcp-server django-indexer

:: Run the Python script
python run_mcp.py

pause 