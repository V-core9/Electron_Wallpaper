const verify = require('../helpers/verify')
const path = require('path')

//* Actual Config
const cfg = {
  version: require('../../package.json').version || '1.0.0',

  //* Debug level
  debug: false,
  exiting: false,
  configFilePath: path.join(__dirname, '../temp/$_config.json'),
  tasksListFilePath: path.join(__dirname, '../temp/$_tasks.json'),

  //* Electron Window Config
  title: 'Electron Wallpaper',
  accessibleTitle: 'Electron Wallpaper',

  width: 1280,
  height: 720,
  maximized: false,

  //* STATS
  notify: true,
  backgroundUpdates: true,

  //* API KEYS
  weatherApiKey: null,
  weatherCity: 'Kljajicevo',
  weatherUnits: 'metric',

  minimizeToTray: true,
}

//? Setters with Verification Methods
const setters = {
  exiting: async (val) =>
    (await verify.isBool(val)) ? (cfg.exiting = val) : null,

  debug: async (val) => ((await verify.isBool(val)) ? (cfg.debug = val) : null),

  title: async (val) => ((await verify.isName(val)) ? (cfg.title = val) : null),

  accessibleTitle: async (val) =>
    (await verify.isName(val)) ? (cfg.accessibleTitle = val) : null,

  maximized: async (val) =>
    (await verify.isBool(val)) ? (cfg.maximized = val) : null,

  notify: async (val) =>
    (await verify.isBool(val)) ? (cfg.notify = val) : null,

  width: async (val) =>
    (await verify.isPositiveInteger(val)) && val > 320
      ? (cfg.width = val)
      : null,

  height: async (val) =>
    (await verify.isPositiveInteger(val)) && val > 320
      ? (cfg.width = val)
      : null,

  weatherApiKey: async (val) =>
    (await verify.isWeatherApiKey(val)) ? (cfg.weatherApiKey = val) : null,
  weatherCity: async (val) =>
    (await verify.isName(val)) ? (cfg.weatherCity = val) : null,
  weatherUnits: async (val) =>
    val === 'metric' || val === 'imperial' ? (cfg.weatherUnits = val) : null,

  minimizeToTray: async (val) =>
    (await verify.isBool(val)) ? (cfg.minimizeToTray = val) : null,
}

//! Usable Config
const config = {
  has: async (key) => cfg[key] !== undefined,

  getSy: (key) => (typeof key !== 'string' ? cfg : cfg[key]),

  get: async (key) => config.getSy(key),

  keys: async () => Object.keys(cfg),

  set: async (key, val) => {
    if (key in setters) {
      let rez = await setters[key](val)
      if (rez === null) return false
      return true
    }
    return false
  },

  mSet: async (mObj) => {
    if (await verify.isObject(mObj)) {
      for (let key in mObj) {
        await config.set(key, mObj[key])
      }
    }
  },
}

module.exports = config
