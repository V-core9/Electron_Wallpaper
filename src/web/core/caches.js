const { V_Core_Cache } = require('v_core_cache')

const dataCache = new V_Core_Cache()
const renderCache = new V_Core_Cache()

module.exports = {
  dataCache,
  renderCache,
}
