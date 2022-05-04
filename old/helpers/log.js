const config = require('./config');

const log = async (...args) => {
  if (config.debug) {
    console.log(...args);
  }
};

module.exports = log;