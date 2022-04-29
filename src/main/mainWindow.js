const { BrowserWindow } = require('electron');

const mainWindow = new BrowserWindow({
  width: 1280,
  height: 720,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  }
});

module.exports = mainWindow;