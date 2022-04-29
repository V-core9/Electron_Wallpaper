const v_rifier = require('v_rifier');

let app_debug = false;
let maximize = true;
let app_version = '0.0.0';
let app_title = 'Electron Wallpaper';



const setAppTitle = async (val) => {
  if (await v_rifier.name(val) === true) app_title = val;
};

const setAppVersion = async (val) => {
  const parts = val.split('.');

  if ((parts.length === 3) && (await v_rifier.integer(parts[0]) === true) && (await v_rifier.integer(parts[1]) === true) && (await v_rifier.integer(parts[2]) === true)) {
    app_version = val;
  }
};



const config = {

  set debug(value) {
    if (typeof value === 'boolean') app_debug = value;
  },

  get debug() {
    return app_debug;
  },

  async toggleDebug() {
    this.debug = !this.debug;
    return this.debug;
  },

  set maximize(value) {
    if (typeof value === 'boolean') maximize = value;
  },

  get maximize() {
    return maximize;
  },

  async toggleMaximize() {
    this.maximize = !this.maximize;
    return this.maximize;
  },

  //? Application Title
  set title(val) {
    setAppTitle(val);
  },

  get title() {
    return app_title;
  },

  //? Version
  set version(val) {
    setAppVersion(val);
  },

  get version() {
    return app_version;
  },

};


module.exports = config;