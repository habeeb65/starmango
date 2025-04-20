@echo off
echo Star Mango - CSV Import Tool
echo ============================
echo.

:: Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Python is not installed or not in the PATH.
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b 1
)

:: Check if the CSV file exists
if not exist sample_sales_import.csv (
    echo Error: sample_sales_import.csv not found.
    echo Please make sure the CSV file is in the current directory.
    pause
    exit /b 1
)

echo Importing sales invoices from sample_sales_import.csv...
echo.

:: Run the Django management command to import the CSV
python manage.py import_sales_csv sample_sales_import.csv

if %ERRORLEVEL% neq 0 (
    echo.
    echo Import failed. Please check the error messages above.
) else (
    echo.
    echo Import completed successfully!
)

pause 