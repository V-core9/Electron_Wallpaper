const { V_Core_Cache } = require('v_core_cache')

const dataCache = new V_Core_Cache()
const renderCache = new V_Core_Cache()

//? cPaths => Cache Paths
const cPathRender = (p) => `gui/render/${p}`

module.exports = {
  cPaths: {
    layoutName: cPathRender('layout-name'),
    lastRender: cPathRender('last-render/value'),
    currentPage: cPathRender('current-page-path'),
  },

  dataCache,

  renderCache,
}
