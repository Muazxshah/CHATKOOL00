#!/bin/bash

echo "======================================"
echo "   ChatKOOL Mobile Setup for Linux"
echo "======================================"
echo

echo "Step 1: Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo
    echo "Installing Node.js..."
    
    # Detect package manager
    if command -v apt &> /dev/null; then
        sudo apt update
        sudo apt install -y nodejs npm
    elif command -v yum &> /dev/null; then
        sudo yum install -y nodejs npm
    elif command -v pacman &> /dev/null; then
        sudo pacman -S nodejs npm
    else
        echo "Please install Node.js manually from https://nodejs.org"
        exit 1
    fi
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