const { watch, cache } = require('../core');
const log = require('../../helpers/log');
const config = require('../../helpers/config');



module.exports = (ipcMain) => {

  try {


    ipcMain.handle('ping', async () => Date.now());



    ipcMain.handle('setAppTitle', async (event, arg) => config.appTitle = arg);

    ipcMain.handle('setAppVersion', async (event, arg) => config.version = arg);



    ipcMain.handle('listBackendAllCache', async () => JSON.stringify(await cache.getAll()));

    ipcMain.handle('purgeBackendCache', async () => await cache.purge());



    ipcMain.handle('listBackendTasks', async (event, arg) => JSON.stringify(await watch.keys()));

    ipcMain.handle('startSpecificTask', async (event, arg) => await watch.start(arg));

    ipcMain.handle('stopSpecificTask', async (event, arg) => await watch.stop(arg));

    ipcMain.handle('deleteSpecificTask', async (event, arg) => await watch.delete(arg));

    ipcMain.handle('endAllTasks', async () => await watch.end());



    //? App Debug Toggle
    ipcMain.handle('toggleDebug', async () => {
      const mainWindow = require('../mainWindow');
      await config.toggleDebug();
      if (config.debug) {
        mainWindow.webContents.openDevTools();
      } else {
        mainWindow.webContents.closeDevTools();
      }
      return config.debug;
    });


    //? Window Maximize Toggle
    ipcMain.handle('maximizeAppToggle', async () => {
      const mainWindow = require('../mainWindow');
      await config.toggleMaximize();
      if (config.maximize) {
        mainWindow.maximize();
      } else {
        mainWindow.unmaximize();
      }
      return config.maximize;
    });

    //? Window Minimize Toggle
    ipcMain.handle('minimizeAppToggle', async () => {
      const mainWindow = require('../mainWindow');
      mainWindow.minimize();
    });


    //? Exit Application Handle
    ipcMain.handle('EXIT_APPLICATION', async () => require('../mainWindow').close());

    return true;


  } catch (error) {
    log(error);
    return false;
  }

};