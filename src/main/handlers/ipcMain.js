const { watch, cache } = require('../core');
const { log } = require('../../helpers/logger');
const config = require('../../config');

const tasks = require('../tasks');

module.exports = (ipcMain) => {

  try {


    ipcMain.handle('ping', async () => Date.now());

    ipcMain.handle('getConfig', async () => await config.get());


    ipcMain.handle('setAppTitle', async (event, arg) => {
      await config.set('title', arg);
      return await config.get('title');
    });

    ipcMain.handle('setAppVersion', async (event, arg) => config.version = arg);



    ipcMain.handle('listBackendAllCache', async () => JSON.stringify(await cache.getAll()));

    ipcMain.handle('purgeBackendCache', async () => await cache.purge());



    ipcMain.handle('listBackendTasks', async (event, arg) => JSON.stringify(await watch.stats()));

    ipcMain.handle('startSpecificTask', async (event, arg) => await watch.start(arg));

    ipcMain.handle('stopSpecificTask', async (event, arg) => await watch.stop(arg));

    ipcMain.handle('deleteSpecificTask', async (event, arg) => await watch.delete(arg));

    ipcMain.handle('endAllTasks', async () => await watch.end());



    //? App Debug Toggle
    ipcMain.handle('toggleDebug', async () => {
      const mainWindow = require('../mainWindow');
      await config.set('debug', !await config.get('debug'));
      const status = await config.get('debug');
      if (status) {
        mainWindow.webContents.openDevTools();
      } else {
        mainWindow.webContents.closeDevTools();
      }
      return status;
    });


    //? Available Tasks
    ipcMain.handle('listAvailableTasks', async () => Object.keys(tasks));

    //? Window Maximize Toggle
    ipcMain.handle('maximizeAppToggle', async () => {
      const mainWindow = require('../mainWindow');
      await config.set('maximized', !await config.get('maximized'));

      const status = await config.get('maximized');
      if (status) {
        mainWindow.maximize();
      } else {
        mainWindow.unmaximize();
      }
      return status;
    });

    //? Window Minimize Toggle
    ipcMain.handle('minimizeAppToggle', async () => {
      const mainWindow = require('../mainWindow');
      mainWindow.minimize();
    });

    ipcMain.handle('isMaximized', async () => require('../mainWindow').isMaximized());


    //? Exit Application Handle
    ipcMain.handle('EXIT_APPLICATION', async () => {
      require('../mainWindow').hide();
      require('../tray').recreateMainMenu();
    });


    ipcMain.handle('windowBlur', async () => {
      log('windowBlur Event');
    });

    ipcMain.handle('windowFocus', async () => {
      log('windowFocus Event');
    });

    ipcMain.handle('setOpenWeatherSettings', async (event, arg) => {
      await config.mSet(arg);
      return await config.get();
    });

    ipcMain.handle('toggleNotifications', async () => { 
      await config.set('notify', !await config.get('notify'));
      return await config.get('notify');
    });


    return true;


  } catch (error) {
    log(error);
    return false;
  }

};