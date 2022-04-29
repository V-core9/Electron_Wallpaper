
const { V_Watch } = require('v_core_timers');
const V_Core_Cache = require('v_core_cache');

const cache = new V_Core_Cache();
const watch = new V_Watch();

let counter = 0;
let secCounter = 0;

watch.new('example_back_timer_task', 1000, async () => counter++);
watch.new('second_useless_task', 1000, async () => secCounter++);

watch.on('run', async (key) => console.log(key));

module.exports = {
  cache: cache,
  watch: watch,
};