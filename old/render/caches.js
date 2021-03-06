const log = require('../helpers/log');
const V_Core_Cache = require('v_core_cache');

const dataCache = new V_Core_Cache();
const renderCache = new V_Core_Cache();


dataCache.on('miss', async (key) => log('Cache_Miss [dataCache]: ', key));
renderCache.on('miss', async (key) => log('Cache_Miss [renderCache]: ', key));

module.exports = {
  dataCache,
  renderCache,
};