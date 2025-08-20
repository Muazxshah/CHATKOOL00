@echo off
echo ==========================================
echo    ChatKOOL - FINAL SDK 53 SETUP
echo ==========================================
echo.

echo Cleaning all dependencies...
if exist "package-lock.json" del "package-lock.json"
if exist "node_modules" rmdir /s /q "node_modules"
if exist ".expo" rmdir /s /q ".expo"

echo.
echo Installing SDK 53 dependencies...
npm install

echo.
echo Installing Expo CLI...
npm install -g @expo/cli

echo.
echo Starting ChatKOOL mobile app...
echo ✅ This will work with your Expo Go SDK 53!
echo.
npx expo start --clear

pause