const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const { watch, cache } = require('../core')
const { log } = require('../../helpers/logger')
const config = require('../../config')

const tasks = require('../tasks')
let appTasks = require('../core/app-tasks')

watch.on('stop', async (key) => (appTasks[key].enabled = false))
watch.on('start', async (key) => (appTasks[key].enabled = true))
watch.on('delete', async (key) => delete appTasks[key])
watch.on('end', async () => (appTasks = {}))

const generatedHandle = (cacheName, taskName) => {
  return async (evn, arg) => {
    const cached = await cache.get(cacheName)
    if (cached) return cached
    const data = await tasks[taskName](cacheName)
    log(`${cacheName} : ${taskName}`, data)
    return data
  }
}

const ipcMainHandlers = {
  ping: async () => Date.now(),

  'application/config/get': async () => await config.get(),

  setAppTitle: async (event, arg) => {
    await config.set('title', arg)
    return await config.get('title')
  },

  setAppVersion: async (event, arg) => (config.version = arg),

  'mtr/cache/list': async () => [...(await cache.getAll())],

  'mtr/cache/purge': async () => await cache.purge(),

  listBackendTasks: async (event, arg) => JSON.stringify(await watch.stats()),

  endAllTasks: async () => await watch.end(),

  toggleDebug: async () => {
    const mainWindow = require('../mainWindow')
    await config.set('debug', !(await config.get('debug')))
    const status = await config.get('debug')
    if (status) {
      mainWindow.webContents.openDevTools()
    } else {
      mainWindow.webContents.closeDevTools()
    }
    return status
  },

  maximizeAppToggle: async () => {
    const mainWindow = require('../mainWindow')
    await config.set('maximized', !(await config.get('maximized')))

    const status = await config.get('maximized')
    if (status) {
      mainWindow.maximize()
    } else {
      mainWindow.unmaximize()
    }
    return status
  },

  minimizeAppToggle: async () => {
    const mainWindow = require('../mainWindow')
    mainWindow.minimize()
  },

  isMaximized: async () => require('../mainWindow').isMaximized(),

  windowBlur: async () => log('Event: windowBlur'),

  windowFocus: async () => log('Event: windowFocus'),

  setOpenWeatherSettings: async (event, arg) => {
    await config.mSet(arg)
    return await config.get()
  },

  'notifications/toggle': async () => {
    await config.set('notify', !(await config.get('notify')))
    log('notifications set to: ' + (await config.get('notify')))
    return await config.get('notify')
  },

  'tasks/new': async (event, arg) => {
    log('Create New Task: ', arg)
    const { name, interval, callback, enabled, initRun } = JSON.parse(arg)
    await watch.new(name, interval, tasks[callback], enabled)
    if (initRun) watch.run(name)
    appTasks[name] = { interval, callback, enabled, initRun }
    return await watch.stats()
  },
  'tasks/start': async (event, arg) => await watch.start(arg),
  'tasks/stop': async (event, arg) => await watch.stop(arg),
  'tasks/delete': async (event, arg) => await watch.delete(arg),
  'tasks/available/list': async () => Object.keys(tasks),

  toggleMinimizeToTray: async () => {
    await config.set('minimizeToTray', !(await config.get('minimizeToTray')))
    log('minimize to tray set to: ' + (await config.get('minimizeToTray')))
    return await config.get('minimizeToTray')
  },

  'domain/list': async () => await prisma.domain.findMany(),

  ipAddress: generatedHandle('ipAddress', 'ipAddress'),

  checkLocalPorts: generatedHandle('checkLocalPorts', 'checkLocalPorts'),

  'application/command/exit': async () => {
    if ((await config.get('minimizeToTray')) !== true) {
      require('../handlers/exiting')()
    } else {
      require('../notify').minimizeToTray()
      require('../mainWindow').hide()
      require('../tray').recreateMainMenu()
    }
  },
}

module.exports = (ipcMain) => {
  try {
    Object.keys(ipcMainHandlers).forEach((k) => ipcMain.handle(k, ipcMainHandlers[k]))
    return true
  } catch (error) {
    log(error)
    return false
  }
}
