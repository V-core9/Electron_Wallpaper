const verify = require('../../helpers/verify')

const { ipcRenderer } = require('electron')
const { dataCache, cPaths } = require('./caches')
const { log, warn } = require('../../helpers/logger')

const config = require('../../config')

ipcRenderer.on('context-menu-command', (e, command) => {
  // ...
  log(e, command)
})

// Example Application
const actions = {
  'application/command/exit': async () => {
    await ipcRenderer.invoke('application/command/exit')
  },
  'application/initialize': async () => {
    actions['application/config/get']()
    actions['tasks/available/list']()
    actions.listBackendTasks()
    actions['mtr/cache/list']()

    setTimeout(() => {
      dataCache.set('app_loaded', true)
    }, 1000)
  },
  'application/config/get': async () => {
    await config.mSet(await ipcRenderer.invoke('application/config/get'))
    await dataCache.set('application_config', await config.get())
  },

  setAppTitle: async () => {
    const val = document.querySelector('#customTitle').value

    if (await verify.isString(val)) {
      const rez = await ipcRenderer.invoke('setAppTitle', val)
      await config.set('title', rez)
      dataCache.set('appConfig', await config.get())
      return true
    }

    warn('Invalid title: ', val)
    return false
  },

  'gui/cache/stats/log': async () => {
    log(await dataCache.stats())
  },
  'gui/cache/stats/purge': async () => {
    await dataCache.purgeStats()
  },
  'gui/cache/purge': async () => {
    await dataCache.purge()
    await actions['application/initialize']()
  },
  'gui/cache/all/log': async () => {
    log(await dataCache.getAll())
  },
  'gui/cache/demo/log/undefined': async () => {
    log(await dataCache.get('logUndefinedItem'))
  },

  'mtr/cache/list': async () => {
    const resp = await ipcRenderer.invoke('mtr/cache/list')
    log(resp)
    await dataCache.set('mtr/cache/list', resp)
  },

  'mtr/cache/purge': async () => {
    await dataCache.set('mtr/cache/purge', JSON.parse(await ipcRenderer.invoke('mtr/cache/purge')))
    await actions['mtr/cache/purge']()
  },

  testBackendPing: async () => {
    const beforeTime = Date.now()
    const rez = await ipcRenderer.invoke('ping', beforeTime)
    const afterTime = Date.now()
    log(rez)
    await dataCache.set('testBackendPing', {
      fb: rez - beforeTime,
      bf: afterTime - rez,
    })
  },

  listBackendTasks: async () => {
    const data = JSON.parse(await ipcRenderer.invoke('listBackendTasks'))
    log(data)
    await dataCache.set('listBackendTasks', data)
  },

  toggleDebug: async () => {
    const response = await ipcRenderer.invoke('toggleDebug')
    log('toggleDebug', response)
    await config.set('debug', response)
    if ((await config.get('debug')) === false && (await dataCache.get(cPaths.currentPage)) === 'debug')
      await dataCache.set(cPaths.currentPage, 'home')
    await actions.listBackendTasks()
  },

  maximizeAppToggle: async () => {
    const response = await ipcRenderer.invoke('maximizeAppToggle')
    log('maximize', response)
    await config.set('maximized', response)
  },

  minimizeAppToggle: async () => {
    const response = await ipcRenderer.invoke('minimizeAppToggle')
    log('minimizeAppToggle', response)
    await dataCache.set('minimizeAppToggle', response)
  },

  openPage: async (event) => {
    if (typeof event === 'string') return dataCache.set('page', event)
    const page = event.target.getAttribute('page')
    await dataCache.set(cPaths.currentPage, page)
  },

  windowBlur: async (event) => {
    const response = await ipcRenderer.invoke('windowBlur')
    log('windowBlur', response)
    await dataCache.set('windowBlur', response)
  },

  windowFocus: async (event) => {
    const response = await ipcRenderer.invoke('windowFocus')
    log('windowFocus', response)
    await dataCache.set('windowFocus', response)
  },

  isMaximized: async (event) => {
    const response = await ipcRenderer.invoke('isMaximized')
    await config.set('maximized', response)
    await dataCache.set('isMaximized', response)
  },

  toggleNewTaskForm: async () => {
    await dataCache.set('newTaskModalShown', !(await dataCache.get('newTaskModalShown')))
  },

  setOpenWeatherSettings: async () => {
    const key = document.querySelector('#weatherApiKey').value
    const city = document.querySelector('#weatherCity').value
    const units = document.querySelector('#weatherUnits').value

    const data = {
      weatherApiKey: key,
      weatherCity: city,
      weatherUnits: units,
    }

    const response = await ipcRenderer.invoke('setOpenWeatherSettings', data)
    await config.mSet(response)
    await dataCache.set('appConfig', await config.get())
  },

  'notifications/toggle': async () => {
    const response = await ipcRenderer.invoke('notifications/toggle')
    await config.set('notify', response)
    await dataCache.set('appConfig', await config.get())
  },

  'tasks/available/list': async () => {
    return await dataCache.set('tasks/available/list', await ipcRenderer.invoke('tasks/available/list'))
  },
  'tasks/new': async (event) => {
    console.log(event)
    if (event.isTrusted !== undefined) {
      event = {
        name: document.querySelector('#newTaskName').value,
        interval: document.querySelector('#newTaskInterval').value,
        callback: document.querySelector('#newTaskFunction').value,
        enabled: document.querySelector('#newTaskEnabled').checked,
      }
    }
    log(await ipcRenderer.invoke('tasks/new', JSON.stringify(event)))
    await actions.listBackendTasks()
  },
  'tasks/start': async (event) => {
    const taskName = event.target.parentElement.parentElement.getAttribute('taskName')

    const response = await ipcRenderer.invoke('tasks/start', taskName)
    log(response)

    log('stating a task', taskName)
    await actions.listBackendTasks()
  },
  'tasks/delete': async (event) => {
    const taskName = event.target.parentElement.parentElement.getAttribute('taskName')

    const response = await ipcRenderer.invoke('tasks/delete', taskName)
    log(response)

    log('DELETING a task', taskName)
    await actions.listBackendTasks()
  },

  'tasks/stop': async (event) => {
    const taskName = event.target.parentElement.parentElement.getAttribute('taskName')

    const response = await ipcRenderer.invoke('tasks/stop', taskName)
    log(response)

    log('STOPPING a task', taskName)
    await actions.listBackendTasks()
  },

  endAllTasks: async () => {
    const response = await ipcRenderer.invoke('endAllTasks')
    log('ENDING ALL TASKS', response)
    await actions.listBackendTasks()
  },
  toggleMinimizeToTray: async () => {
    const response = await ipcRenderer.invoke('toggleMinimizeToTray')
    await config.set('minimizeToTray', response)
    await dataCache.set('appConfig', await config.get())
  },

  domainList: async () => {
    const data = await ipcRenderer.invoke('domain/list')
    log(data)
    await dataCache.set('domain/list', data)
  },

  ipAddress: async () => {
    const data = await ipcRenderer.invoke('ipAddress')
    log(data)
    await dataCache.set('device_ip_address', data)
  },

  checkLocalPorts: async () => {
    const data = await ipcRenderer.invoke('checkLocalPorts')
    log(data)
    await dataCache.set('checkLocalPorts', data)
  },
}

module.exports = actions
