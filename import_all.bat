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

echo ===================================
echo STEP 1: Import Purchase Invoices
echo ===================================
echo.

:: Check if the Purchase CSV file exists
if not exist sample_purchase_import.csv (
    echo Warning: sample_purchase_import.csv not found. Skipping purchase invoice import.
) else (
    echo Importing purchase invoices from sample_purchase_import.csv...
    python manage.py import_purchase_csv sample_purchase_import.csv
    
    if %ERRORLEVEL% neq 0 (
        echo Import failed. Please check the error messages above.
    ) else (
        echo Import completed successfully!
    )
)

echo.
echo ===================================
echo STEP 2: Import Sales Invoices
echo ===================================
echo.

:: Check if the Sales CSV file exists
if not exist sample_sales_import.csv (
    echo Warning: sample_sales_import.csv not found. Skipping sales invoice import.
) else (
    echo Importing sales invoices from sample_sales_import.csv...
    python manage.py import_sales_csv sample_sales_import.csv
    
    if %ERRORLEVEL% neq 0 (
        echo Import failed. Please check the error messages above.
    ) else (
        echo Import completed successfully!
    )
)

echo.
echo ===================================
echo CSV Import Process Completed
echo ===================================
echo Please check the messages above for any errors or warnings.
echo.

pause 