const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "VertexERP Desktop",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.js')
    },
    icon: path.join(__dirname, 'public/icons/PWA-512.png'),
    autoHideMenuBar: true
  });

  // Determine if running in development or production mode
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // In development, load Next.js local server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the configured live VertexERP URL or standard production server
    const prodUrl = process.env.VERTEX_SERVER_URL || 'http://localhost:3000';
    mainWindow.loadURL(prodUrl);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open external links (like CFDI downloads or manuals) in the system's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
