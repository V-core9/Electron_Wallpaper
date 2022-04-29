const { ipcRenderer } = require('electron');
const { dataCache } = require('./caches');
const log = require('../helpers/log');

const config = require('../helpers/config');

// Example Application
const actions = {
  changeAppVersion: async () => await dataCache.set('application_version', document.querySelector('#customVersion').value),
  changeAppTitle: async () => await dataCache.set('application_title', document.querySelector('#customTitle').value),
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

  listBackendTasks: async () => {
    await dataCache.set('listBackendTasks', JSON.parse(await ipcRenderer.invoke('listBackendTasks')));
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
    config.debug = response;
    await actions.listBackendTasks();
  },


  maximizeAppToggle: async () => {
    const response = await ipcRenderer.invoke('maximizeAppToggle');
    log('maximizeAppToggle', response);
    await dataCache.set('maximizeAppToggle', response);
  },

  exitApplication: async () => {
    await ipcRenderer.invoke('EXIT_APPLICATION');
  },

  minimizeAppToggle: async () => {
    const response = await ipcRenderer.invoke('minimizeAppToggle');
    log('minimizeAppToggle', response);
    await dataCache.set('minimizeAppToggle', response);
  }
};

module.exports = actions;