@echo off
echo ================================================
echo    Fixing and Starting Frontend Development Server
echo ================================================
echo.

cd /d "%~dp0"

echo 1. Updating browserslist database...
call npx update-browserslist-db@latest

echo 2. Installing dependencies...
call npm install

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
