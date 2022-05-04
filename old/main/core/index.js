const log = require('../../helpers/log');

const { V_Watch } = require('v_core_timers');
const V_Core_Cache = require('v_core_cache');

const cache = new V_Core_Cache();
const watch = new V_Watch();

watch.on('new', async (data) => log('New Task: ', data));
watch.on('run', async (data) => log('Run Task: ', data));
watch.on('stop', async (data) => log('Stop Task: ', data));

module.exports = {
  cache: cache,
  watch: watch,
};