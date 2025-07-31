#!/bin/bash
set -e

echo "Forcing npm installation..."
npm install --legacy-peer-deps

echo "Running turbo build..."
npx turbo run build 