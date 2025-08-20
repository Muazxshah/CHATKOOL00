@echo off
echo ==========================================
echo    ChatKOOL Mobile - FINAL WORKING SETUP
echo ==========================================
echo.

echo Step 1: Cleaning old dependencies...
if exist "package-lock.json" del "package-lock.json"
if exist "node_modules" rmdir /s /q "node_modules"

echo.
echo Step 2: Installing STABLE dependencies (Expo SDK 51)...
npm install

echo.
echo Step 3: Starting ChatKOOL mobile app...
echo.
echo ✅ Ready! Your mobile app will start now.
echo.
echo Options when it starts:
echo   - Press 'w' for web testing
echo   - Scan QR code with Expo Go app for phone testing
echo.
npm start

pause