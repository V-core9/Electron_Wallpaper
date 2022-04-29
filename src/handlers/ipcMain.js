const { watch, cache } = require('../core')

module.exports = (ipcMain) => {

  try {
    ipcMain.handle('ping', async () => Date.now());

    ipcMain.handle('listBackendTasks', async (event, arg) => {
      console.log(event);
      console.log(arg);
      let data = await watch.getAll();
      console.log(data);
      return JSON.stringify(data);
    });

    ipcMain.handle('listBackendAllCache', async () => {
      return JSON.stringify(await cache.getAll());
    });

    return true;

  } catch (error) {

    console.log(error);
    return false;

  }

};