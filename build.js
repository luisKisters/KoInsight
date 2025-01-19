#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BE_FOLDER = path.resolve(__dirname, 'server');
const DIST = path.resolve(__dirname, 'dist');

function buildBackend() {
  console.log('Building backend...');
  execSync('npm --prefix server run build', { stdio: 'inherit' });
}

function buildFrontend() {
  console.log('Building frontend...');
  execSync('npm --prefix web run build', { stdio: 'inherit' });
}

function extractBuild() {
  // Create Data folder if missing
  // fs.mkdirSync(DATA, { recursive: true });

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
  extractBuild();
}

main();
