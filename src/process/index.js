const { app, BrowserWindow, Notification } = require('electron');
const path = require('path');

const config = require('../config');



//! BASIC NOTIFICATION

const NOTIFICATION_TITLE = 'Basic Notification';
const NOTIFICATION_BODY = 'Notification from the Main process';

function showNotification() {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show();
}

//! NOTIFICATION DEMO



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}



const createWindow = async () => {
  // Create the browser window.
  const mainWindow = require('./config/mainWindow');

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../web/index.html'));

  // Open the DevTools.
  if (await config.get('debug')) mainWindow.webContents.openDevTools();
  if (await config.get('maximized')) mainWindow.maximize();

  showNotification();
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


