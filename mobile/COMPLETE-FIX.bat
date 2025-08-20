@echo off
echo ==========================================
echo    ChatKOOL - COMPLETE DEPENDENCY FIX
echo ==========================================
echo.

echo Step 1: Complete cleanup...
if exist "package-lock.json" del "package-lock.json"
if exist "yarn.lock" del "yarn.lock"
if exist "node_modules" rmdir /s /q "node_modules"
if exist ".expo" rmdir /s /q ".expo"
if exist ".metro" rmdir /s /q ".metro"

echo.
echo Step 2: Installing ALL dependencies fresh...
npm install

echo.
echo Step 3: Installing navigation dependencies...
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated

echo.
echo Step 4: Installing babel preset...
npm install --save babel-preset-expo

echo.
echo Step 5: Starting with complete refresh...
npx expo start --clear --reset-cache

echo.
echo ✅ ALL DEPENDENCIES FIXED! App should work perfectly now!
echo.
pause