const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const net = require('net');

console.log("🚀 Initializing Vannate Universal Launcher...");

// 1. Clear caches
const caches = ['.next', '.next-live'];
caches.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`🧹 Clearing cache: ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

// 2. Find available port
function findAvailablePort(startPort, callback) {
  const server = net.createServer();
  server.listen(startPort, () => {
    const port = server.address().port;
    server.close(() => callback(port));
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      findAvailablePort(startPort + 1, callback);
    } else {
      callback(startPort); // Fallback
    }
  });
}

const START_PORT = parseInt(process.env.PORT || '3000', 10);

findAvailablePort(START_PORT, (port) => {
  console.log(`✅ Found available port: ${port}`);
  console.log(`🌐 Launching Fullstack Engine (Frontend, Backend APIs, Database Proxies)...`);

  const nextEnv = Object.assign({}, process.env, { PORT: port });
  
  const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], {
    env: nextEnv,
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    console.log(`Engine shut down with code ${code}`);
  });
});
