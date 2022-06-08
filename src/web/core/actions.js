const verify = require('../../helpers/verify');

const { ipcRenderer } = require('electron');
const { dataCache } = require('./caches');
const { log } = require('../../helpers/logger');

const config = require('../../config');




ipcRenderer.on('context-menu-command', (e, command) => {
  // ...
  log(e, command);
});

// Example Application
const actions = {

  getConfig: async () => {
    await config.mSet(await ipcRenderer.invoke('getConfig'));
    await dataCache.set('application_config', await config.get());
  },

  changeAppTitle: async () => {
    const val = document.querySelector('#customTitle').value;

    if (await verify.isName(val)) {
      const rez = await ipcRenderer.invoke('setAppTitle', val);
      await config.set('title', rez);
      dataCache.set('appConfig', await config.get());
      return true;
    }
    log('Invalid title: ', val);
    return false;
  },


  logStats: async () => log(await dataCache.stats()),


  purgeCache: async () => await dataCache.purge(),


  purgeCacheStats: async () => await dataCache.purgeStats(),


  logAllCache: async () => log(await dataCache.getAll()),


  logUndefinedItem: async () => log(await dataCache.get('logUndefinedItem')),

  testBackendPing: async () => {
    const beforeTime = Date.now();
    const rez = await ipcRenderer.invoke('ping', beforeTime);
    const afterTime = Date.now();
    log(rez);
    await dataCache.set('testBackendPing', { fb: rez - beforeTime, bf: afterTime - rez });
  },


  listAvailableTasks: async () => await dataCache.set('listAvailableTasks', await ipcRenderer.invoke('listAvailableTasks')),


  listBackendTasks: async () => {
    const data = JSON.parse(await ipcRenderer.invoke('listBackendTasks'));
    log(data);
    await dataCache.set('listBackendTasks', data);
  },


  listBackendAllCache: async () => {
    await dataCache.set('listBackendAllCache', JSON.parse(await ipcRenderer.invoke('listBackendAllCache')));
  },


  purgeBackendCache: async () => {
    await dataCache.set('purgeBackendCache', JSON.parse(await ipcRenderer.invoke('purgeBackendCache')));
    await actions.listBackendAllCache();
  },


  startSpecificTask: async (event) => {
    const taskName = event.target.parentElement.parentElement.getAttribute('taskName');

    const response = await ipcRenderer.invoke('startSpecificTask', taskName);
    log(response);

    log('stating a task', taskName);
    await actions.listBackendTasks();
  },


  stopSpecificTask: async (event) => {
    const taskName = event.target.parentElement.parentElement.getAttribute('taskName');

    const response = await ipcRenderer.invoke('stopSpecificTask', taskName);
    log(response);

    log('STOPPING a task', taskName);
    await actions.listBackendTasks();
  },


  deleteSpecificTask: async (event) => {
    const taskName = event.target.parentElement.parentElement.getAttribute('taskName');

    const response = await ipcRenderer.invoke('deleteSpecificTask', taskName);
    log(response);

    log('DELETING a task', taskName);
    await actions.listBackendTasks();
  },


  endAllTasks: async () => {
    const response = await ipcRenderer.invoke('endAllTasks');
    log('ENDING ALL TASKS', response);
    await actions.listBackendTasks();
  },


  toggleDebug: async () => {
    const response = await ipcRenderer.invoke('toggleDebug');
    log('toggleDebug', response);
    await config.set('debug', response);
    if (await config.get('debug') === false && await dataCache.get('currentPage') === 'debug') await dataCache.set('currentPage', 'home');
    await actions.listBackendTasks();
  },


  maximizeAppToggle: async () => {
    const response = await ipcRenderer.invoke('maximizeAppToggle');
    log('maximize', response);
    await config.set('maximized', response);
  },


  exitApplication: async () => {
    await ipcRenderer.invoke('EXIT_APPLICATION');
  },


  minimizeAppToggle: async () => {
    const response = await ipcRenderer.invoke('minimizeAppToggle');
    log('minimizeAppToggle', response);
    await dataCache.set('minimizeAppToggle', response);
  },

  openPage: async (event) => {
    if (typeof event === 'string') return dataCache.set('page', event);
    
    const page = event.target.getAttribute('page');
    await dataCache.set('currentPage', page);
  },


  windowBlur: async (event) => {
    const response = await ipcRenderer.invoke('windowBlur');
    log('windowBlur', response);
    await dataCache.set('windowBlur', response);
  },

  windowFocus: async (event) => {
    const response = await ipcRenderer.invoke('windowFocus');
    log('windowFocus', response);
    await dataCache.set('windowFocus', response);
  },

  isMaximized: async (event) => {
    const response = await ipcRenderer.invoke('isMaximized');
    await config.set('maximized', response);
    await dataCache.set('isMaximized', response);
  },


  toggleNewTaskForm: async () => { 
    await dataCache.set('newTaskModalShown', !await dataCache.get('newTaskModalShown'));
  },

  setWeatherApiKey: async () => {
    const key = document.querySelector('#weatherApiKey').value;
    const response = await ipcRenderer.invoke('setWeatherApiKey', key);
    await config.set('weatherApiKey', response);
    await dataCache.set('appConfig', await config.get());
  }
};

module.exports = actions;