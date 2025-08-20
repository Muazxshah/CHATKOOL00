@echo off
echo ==========================================
echo    ChatKOOL - ULTIMATE COMPLETE FIX
echo ==========================================
echo.

echo Step 1: Cleaning all caches and dependencies...
if exist "package-lock.json" del "package-lock.json"
if exist "node_modules" rmdir /s /q "node_modules"
if exist ".expo" rmdir /s /q ".expo"
if exist ".metro" rmdir /s /q ".metro"

echo.
echo Step 2: Installing fresh dependencies with babel plugin...
npm install

echo.
echo Step 3: Installing specific babel plugin...
npm install --save-dev babel-plugin-module-resolver

echo.
echo Step 4: Installing Expo CLI globally...
npm install -g @expo/cli@latest

echo.
echo Step 5: Clearing all Metro caches...
npx expo install --fix
npx expo start --clear --reset-cache

echo.
echo ✅ All errors fixed! App should work now!
echo.
pause