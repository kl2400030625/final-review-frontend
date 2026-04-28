#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

const root = process.cwd();
const candidates = [
  path.join(root, 'backend'),
  path.join(root, 'server'),
  path.join(root, 'api'),
  path.join(root, '..', 'final_review_backend'),
  path.join(root, '..', 'final_review_backend', 'self-learning-backend'),
  path.join(root, '..', 'backend'),
  path.join(root, '..', 'server'),
  path.join(root, '..', 'api'),
  path.join(root, 'frontend_backend'),
];

function findBackend() {
  for (const c of candidates) {
    if (!exists(c)) continue;
    if (exists(path.join(c, 'package.json')) || exists(path.join(c, 'pom.xml'))) return c;
  }
  return null;
}

function runCmd(cmd, args, cwd) {
  const child = spawn(cmd, args, { cwd, shell: true, stdio: 'inherit' });
  child.on('exit', (code) => {
    if (code !== 0) console.warn(`${cmd} exited with ${code} in ${cwd}`);
  });
  return child;
}

async function main() {
  const args = process.argv.slice(2);
  const installOnly = args.includes('--install-only');

  const frontendDir = path.join(root, 'frontend');
  if (!exists(frontendDir) || !exists(path.join(frontendDir, 'package.json'))) {
    console.error('Could not find frontend in ./frontend. Please run this from the project root.');
    process.exit(1);
  }

  const backendDir = findBackend();

  if (installOnly) {
    console.log('Installing dependencies for frontend' + (backendDir ? ' and backend' : ''));
    runCmd('npm', ['install'], frontendDir);
    if (backendDir) runCmd('npm', ['install'], backendDir);
    return;
  }

  console.log('Starting frontend...');
  runCmd('npm', ['run', 'dev'], frontendDir);

  if (backendDir) {
    console.log('Starting backend at', backendDir);
    if (exists(path.join(backendDir, 'package.json'))) {
      // choose recommended Node.js start script
      const pkg = JSON.parse(fs.readFileSync(path.join(backendDir, 'package.json'), 'utf8'));
      const script = pkg.scripts && (pkg.scripts.dev ? ['run', 'dev'] : (pkg.scripts.start ? ['start'] : null));
      if (script) {
        runCmd('npm', script, backendDir);
      } else if (exists(path.join(backendDir, 'server.js'))) {
        runCmd('node', ['server.js'], backendDir);
      } else if (exists(path.join(backendDir, 'index.js'))) {
        runCmd('node', ['index.js'], backendDir);
      } else {
        console.warn('No Node backend start script found. Please start it manually.');
      }
    } else if (exists(path.join(backendDir, 'pom.xml'))) {
      // Spring Boot backend
      if (process.platform === 'win32' && exists(path.join(backendDir, 'mvnw.cmd'))) {
        runCmd('mvnw.cmd', ['spring-boot:run'], backendDir);
      } else if (exists(path.join(backendDir, 'mvnw'))) {
        runCmd('./mvnw', ['spring-boot:run'], backendDir);
      } else {
        runCmd('mvn', ['spring-boot:run'], backendDir);
      }
    } else {
      console.warn('No supported backend project found. Please start it manually.');
    }
  } else {
    console.log('No backend detected in common locations. If you have a backend, place it in `./backend` or `./server` or `../backend`.');
  }
}

main();
