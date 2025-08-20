@echo off
echo ======================================
echo    ChatKOOL Mobile Setup for Windows
echo ======================================
echo.

echo Step 1: Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org
    echo 2. Download LTS version
    echo 3. Install with default settings
    echo 4. Restart this script
    pause
    exit /b 1
) else (
    echo ✅ Node.js found: 
    node --version
)

echo.
echo Step 2: Installing Expo CLI globally...
npm install -g @expo/cli
if %errorlevel% neq 0 (
    echo ❌ Failed to install Expo CLI
    pause
    exit /b 1
)

echo.
echo Step 3: Installing mobile app dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Setup Complete! 
echo ========================================
echo.
echo To start the mobile app:
echo   npm start
echo.
echo Then:
echo   - Press 'w' for web testing
echo   - Scan QR code with Expo Go app for phone testing
echo.
pause