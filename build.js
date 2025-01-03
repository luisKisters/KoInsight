#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BE_FOLDER = path.resolve(__dirname, 'server');
const FE_FOLDER = path.resolve(__dirname, 'web');

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
  fs.mkdirSync(path.resolve(__dirname, 'data'), { recursive: true });

  if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
    fs.rmSync(path.resolve(__dirname, 'dist'), { recursive: true });
  }
  fs.cpSync(path.resolve(BE_FOLDER, 'dist'), path.resolve(__dirname, 'dist'), { recursive: true });

  fs.cpSync(
    path.resolve(BE_FOLDER, 'node_modules'),
    path.resolve(__dirname, 'dist', 'node_modules'),
    {
      recursive: true,
    }
  );

  console.log('Build extracted successfully!');
}

function main() {
  buildBackend();
  buildFrontend();
  packageFrontendIntoBackend();
  extractBuild();
}

main();
