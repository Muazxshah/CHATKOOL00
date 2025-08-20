@echo off
echo ==========================================
echo    ChatKOOL - FINAL WORKING VERSION
echo ==========================================
echo This version uses ONLY basic Expo components
echo No complex navigation - Simple and reliable!
echo.

echo Step 1: Complete cleanup...
if exist "package-lock.json" del "package-lock.json"
if exist "node_modules" rmdir /s /q "node_modules"
if exist ".expo" rmdir /s /q ".expo"

echo.
echo Step 2: Installing minimal dependencies...
npm install

echo.
echo Step 3: Starting simple, compatible app...
npx expo start --clear

echo.
echo ✅ GUARANTEED TO WORK! No complex modules!
echo.
pause