const verify = require("../helpers/verify");


//* Actual Config
const _config = {

  //* Debug level
  debug: true,

  //* Electron Window Config
  title: "Electron Wallpaper",
  accessibleTitle: "Electron Wallpaper",

  maximized: false,

  //* STATS
  backgroundUpdates: true,

  //* API KEYS
  weatherApiKey: null,

};


//? Setters with Verification Methods
const setters = {

  debug: async (val) => (await verify.isBool(val)) ? _config.debug = val : null,

  title: async (val) => (await verify.isName(val)) ? _config.title = val : null,

  accessibleTitle: async (val) => (await verify.isName(val)) ? _config.accessibleTitle = val : null,

  weatherApiKey: async (val) => (await verify.isWeatherApiKey(val)) ? _config.weatherApiKey = val : null,

  maximized: async (val) => (await verify.isBool(val)) ? _config.maximized = val : null,

};


//! Usable Config
const config = {

  all: async () => _config,

  has: async (key) => (_config[key] !== undefined),

  get: async (key) => _config[key],

  keys: async () => Object.keys(_config),

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

