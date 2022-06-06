const verify = require("../helpers/verify");
const path = require('path');


//* Actual Config
const cfg = {

  //* Debug level
  debug: true,
  exiting: false,
  configFilePath: path.join(__dirname, '../temp/$_config.json'),

  //* Electron Window Config
  title: "Electron Wallpaper",
  accessibleTitle: "Electron Wallpaper",

  width: 1280,
  height: 720,
  maximized: false,

  //* STATS
  notify: true,
  backgroundUpdates: true,

  //* API KEYS
  weatherApiKey: null,

};


//? Setters with Verification Methods
const setters = {

  exiting: async (val) => (await verify.isBool(val)) ? cfg.exiting = val : null,

  debug: async (val) => (await verify.isBool(val)) ? cfg.debug = val : null,

  title: async (val) => (await verify.isName(val)) ? cfg.title = val : null,

  accessibleTitle: async (val) => (await verify.isName(val)) ? cfg.accessibleTitle = val : null,

  weatherApiKey: async (val) => (await verify.isWeatherApiKey(val)) ? cfg.weatherApiKey = val : null,

  maximized: async (val) => (await verify.isBool(val)) ? cfg.maximized = val : null,

  notify: async (val) => (await verify.isBool(val)) ? cfg.notify = val : null,

  width: async (val) => (await verify.isPositiveInteger(val) && val > 320) ? cfg.width = val : null,

  height: async (val) => (await verify.isPositiveInteger(val) && val > 320) ? cfg.width = val : null,

};


//! Usable Config
const config = {

  has: async (key) => (cfg[key] !== undefined),

  get: async (key) => (typeof key !== 'string') ? cfg : cfg[key],

  keys: async () => Object.keys(cfg),

  set: async (key, val) => {
    if (key in setters) {
      let rez = await setters[key](val);
      if (rez === null) return false;
      return true;
    }
    return false;
  },

  mSet: async (mObj) => {
    if (await verify.isObject(mObj)) {
      for (let key in mObj) {
        await config.set(key, mObj[key]);
      }
    }
  }

};



module.exports = config;

