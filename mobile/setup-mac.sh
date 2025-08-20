#!/bin/bash

echo "======================================"
echo "   ChatKOOL Mobile Setup for Mac"
echo "======================================"
echo

echo "Step 1: Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo
    echo "Installing Node.js using Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew install node
else
    echo "✅ Node.js found: $(node --version)"
fi

echo
echo "Step 2: Installing Expo CLI globally..."
npm install -g @expo/cli

echo
echo "Step 3: Installing mobile app dependencies..."
npm install

echo
echo "========================================"
echo "✅ Setup Complete!"
echo "========================================"
echo
echo "To start the mobile app:"
echo "  npm start"
echo
echo "Then:"
echo "  - Press 'w' for web testing"
echo "  - Scan QR code with Expo Go app for phone testing"
echo