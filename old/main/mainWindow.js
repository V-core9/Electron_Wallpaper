const { BrowserWindow } = require('electron');

const mainWindow = new BrowserWindow({
  title: "Electron Wallpaper",
  accessibleTitle: "Electron Wallpaper",

  shadow: false,

  autoHideMenuBar: true,
  menuBarVisible: false,

  focusable: true,

  minimizable: true,
  maximizable: true,
  fullScreenable: true,

  movable: true,
  resizable: true,
  closable: true,
  frame: false,
  titleBarStyle: "hidden",

  fullScreen: false,
  width: 1280,
  height: 720,

  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  }

});

module.exports = mainWindow;