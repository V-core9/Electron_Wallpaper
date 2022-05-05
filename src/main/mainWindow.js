const { BrowserWindow } = require('electron');

const cfg = require('../config');

const mainWindow = new BrowserWindow({
  title: cfg.title,
  accessibleTitle: cfg.accessibleTitle,

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