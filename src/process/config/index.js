const verify = require("../verify");


// CONFIG Start 
const _config = {
  debug: false,
  title: "Electron Wallpaper",
  accessibleTitle: "Electron Wallpaper",
  weatherApiKey : null,
};


const setters = {

  debug: async (val) => {
    if (await verify.isBool(val)) {
      _config.debug = val;
      return true;
    }
    return false;
  },

  title: async (val) => {
    if (await verify.isName(val)) {
      _config.title = val;
      return true;
    }
    return false;
  },

  accessibleTitle: async (val) => {
    if (await verify.isName(val)) {
      _config.accessibleTitle = val;
      return true;
    }
    return false;
  },

  weatherApiKey: async (val) => {
    if (await verify.isWeatherApiKey(val)) {
      _config.weatherApiKey = val;
      return true;
    }
    return false;
  }

};


const config = {

  keys: async () => Object.keys(_config),

  get: async (key) => _config[key],

  set: async (key, val) => {
    if (key in setters) {
      return await setters[key](val);
    }
    return false;
  },


};



module.exports = config; 