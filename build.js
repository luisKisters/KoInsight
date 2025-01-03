#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BE_FOLDER = path.resolve(__dirname, 'server');
const FE_FOLDER = path.resolve(__dirname, 'web');
const DIST = path.resolve(__dirname, 'dist');
const DATA = path.resolve(__dirname, 'data');

function buildBackend() {
  console.log('Building backend...');
  execSync('npm run build', { cwd: BE_FOLDER, stdio: 'inherit' });
}

function buildFrontend() {
  console.log('Building frontend...');
  execSync('npm run build', { cwd: FE_FOLDER, stdio: 'inherit' });
}

function packageFrontendIntoBackend() {
  const frontendBuildPath = path.resolve(FE_FOLDER, 'dist');
  const backendFEPath = path.resolve(BE_FOLDER, 'dist', 'public');

  console.log('Packaging frontend into backend...');
  if (fs.existsSync(backendFEPath)) {
    fs.rmSync(backendFEPath, { recursive: true });
  }

  fs.mkdirSync(backendFEPath, { recursive: true });
  fs.cpSync(frontendBuildPath, backendFEPath, { recursive: true });

  console.log('Frontend packaged into backend successfully!');
}

function extractBuild() {
  // Create Data folder if missing
  fs.mkdirSync(DATA, { recursive: true });

  // Remove old build if present
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }

  // Copy build to DIST
  fs.cpSync(path.resolve(BE_FOLDER, 'dist'), DIST, { recursive: true });
  fs.cpSync(path.resolve(BE_FOLDER, 'node_modules'), path.resolve(DIST, 'node_modules'), {
    recursive: true,
  });

  console.log('Build extracted successfully!');
}

function main() {
  buildBackend();
  buildFrontend();
  packageFrontendIntoBackend();
  extractBuild();
}

main();
