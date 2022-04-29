
let app_debug = process.env.NODE_ENV === 'developement';


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
  }


  
};

module.exports = config;