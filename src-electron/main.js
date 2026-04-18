const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const { autoUpdater } = require('electron-updater');
const licenseManager = require('./licenseManager');
const selfHealing = require('./selfHealing');
const selfImproving = require('./selfImproving');
const backupRestore = require('./backupRestore');
const taskScheduler = require('./taskScheduler');

let mainWindow;
let serverProcess;
let tray = null;

async function createWindow() {
  // Check License
  const licenseCheck = await licenseManager.verifyLicense();
  if (!licenseCheck.valid) {
    console.error('License check failed:', licenseCheck.reason);
    // Real implementation would prompt UI here, for headless demo we quit if enforcing
    app.quit();
    return;
  }

  // Start periodic license check to enforce one-computer limit
  licenseManager.startPeriodicVerification((reason) => {
    console.error("Periodic License Verification Failed: ", reason);
    app.quit(); // Disable core functions by exiting
  });

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    title: 'VelocityOS - Autonomous Agent Dashboard'
  });

  // Start the background server
  startServer().then(() => {
    mainWindow.loadURL('http://localhost:3000/dashboard');

    // Start self-healing and self-improving modules
    selfHealing.startMonitoring();
    selfImproving.start();
  }).catch(err => {
    console.error('Failed to start server:', err);
    mainWindow.loadFile(path.join(__dirname, '..', 'public', 'auth', 'login.html'));
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();

  // Setup IPC Handlers
  setupIPC();
}

function createTray() {
  const iconPath = path.join(__dirname, '..', 'public', 'icon.png');
  // fallback if icon.png doesn't exist
  if (!require('fs').existsSync(iconPath)) return;

  tray = new (require('electron').Tray)(iconPath);
  const contextMenu = (require('electron').Menu).buildFromTemplate([
    { label: 'Show App', click: () => { if(mainWindow) mainWindow.show(); } },
    { label: 'Quit', click: () => { app.isQuiting = true; app.quit(); } }
  ]);
  tray.setToolTip('VelocityOS');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if(mainWindow) mainWindow.show();
  });
}

function setupIPC() {
  ipcMain.handle('create-backup', async () => {
    return await backupRestore.createBackup(mainWindow);
  });

  ipcMain.handle('restore-backup', async () => {
    return await backupRestore.restoreBackup(mainWindow);
  });

  ipcMain.handle('schedule-task', (event, { id, cron, data }) => {
    return taskScheduler.scheduleTask(id, cron, data);
  });
}

app.on('restart-server', () => {
    console.log("Restarting server...");
    if (serverProcess) {
        serverProcess.kill();
    }
    startServer().catch(err => console.error("Failed to restart server", err));
});

function startServer() {
  return new Promise((resolve, reject) => {
    // Determine the path to server.js (handles packaged vs unpackaged)
    const serverPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'server.js')
      : path.join(__dirname, '..', 'server.js');

    // Set PORT
    const env = Object.create(process.env);
    env.PORT = '3000';
    env.ELECTRON_RUN_AS_NODE = '1';

    serverProcess = spawn(process.execPath, [serverPath], { env });

    serverProcess.stdout.on('data', (data) => {
      console.log(`Server: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });

    serverProcess.on('error', (err) => {
      console.error('Failed to start server process:', err);
      reject(err);
    });

    // Wait for the server to be ready
    waitOn({
      resources: ['http://localhost:3000'],
      timeout: 10000 // 10 seconds
    })
    .then(() => resolve())
    .catch((err) => reject(err));
  });
}

app.on('ready', () => {
    createWindow();
    createTray();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
