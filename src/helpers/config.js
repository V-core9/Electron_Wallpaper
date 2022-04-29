
let app_debug = false;
let maximize = false;

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
  } 

};

module.exports = config;