const { watch, cache } = require('../core');
const log = require('../../helpers/log');
const config = require('../../helpers/config');

module.exports = (ipcMain) => {

  try {

    ipcMain.handle('ping', async () => Date.now());

    ipcMain.handle('listBackendTasks', async (event, arg) => {
      log(event);
      log(arg);
      let data = await watch.keys();
      log(data);
      return JSON.stringify(data);
    });

    ipcMain.handle('listBackendAllCache', async () => {
      return JSON.stringify(await cache.getAll());
    });

    ipcMain.handle('purgeBackendCache', async () => await cache.purge());


    ipcMain.handle('startSpecificTask', async (event, arg) => await watch.start(arg));
    ipcMain.handle('stopSpecificTask', async (event, arg) => await watch.stop(arg));
    ipcMain.handle('deleteSpecificTask', async (event, arg) => await watch.delete(arg));

    ipcMain.handle('endAllTasks', async () => await watch.end());

    ipcMain.handle('toggleDebug', async () => await config.toggleDebug());

    return true;

  } catch (error) {

    log(error);
    return false;

  }

};