const cfg = require('../config');

const log = async (...arg) => (cfg.debug === true) ? console.log(...arg) : null;

module.exports = log;