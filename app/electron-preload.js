const { contextBridge, ipcRenderer } = require('electron');

// Expose safe desktop-specific APIs to the window context of VertexERP
contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  getVersion: () => process.versions.electron,
  closeApp: () => ipcRenderer.send('app:close'),
  minimizeApp: () => ipcRenderer.send('app:minimize'),
  maximizeApp: () => ipcRenderer.send('app:maximize')
});

console.log('⚡ Electron Preload API inyectado con éxito.');
