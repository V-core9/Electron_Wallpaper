const { app, BrowserWindow, ipcMain } = require('electron')

const path = require('path')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

const createWindow = async () => {
  const config = require('../config')

  const { read } = require('v_file_system')

  const data = JSON.parse(await read(await config.get('configFilePath')))
  if (data.exiting == true) data.exiting = false
  await config.mSet(data)

  const notify = require('./notify')

  require('./handlers/ipcMain')(ipcMain)

  require('./core/init')()

  // Create the browser window.
  const mainWindow = require('./mainWindow')

  const { tray } = require('./tray')
  tray()

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../web/index.html'))

  // Open the DevTools.
  if (await config.get('debug')) mainWindow.webContents.openDevTools()
  if (await config.get('maximized')) mainWindow.maximize()

  notify.exampleNotification()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
