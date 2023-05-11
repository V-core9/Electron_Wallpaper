const cfg = require('../config')

module.exports = {
  log: async (...arg) =>
    (await cfg.get('debug')) ? console.log(...arg) : null,
  info: async (...arg) =>
    (await cfg.get('debug')) ? console.info(...arg) : null,
  warn: async (...arg) =>
    (await cfg.get('debug')) ? console.warn(...arg) : null,
  error: async (...arg) =>
    (await cfg.get('debug')) ? console.error(...arg) : null,
  trace: async (...arg) =>
    (await cfg.get('debug')) ? console.trace(...arg) : null,
  // table: async (...arg) => (await cfg.get('debug')) ? console.table(...arg) : null,
}
