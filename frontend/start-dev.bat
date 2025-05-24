@echo off
echo ================================================
echo    Starting Starmango Frontend Development Server
echo ================================================
echo.

cd /d "%~dp0"

echo 1. Checking for temp directory...
if exist "node_modules\.vite" (
  echo Cleaning Vite cache...
  rmdir /s /q "node_modules\.vite"
)

echo 2. Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo Error: Failed to install dependencies. Please check your internet connection.
  pause
  exit /b 1
)

echo 3. Starting development server...
echo.
echo The server will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ================================================

call npm run dev

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Error: The development server failed to start.
  echo Please check the error messages above.
  pause
  exit /b 1
)
