
const { V_Watch } = require('v_core_timers');
const V_Core_Cache = require('v_core_cache');

const cache = new V_Core_Cache();
const watch = new V_Watch();

let counter = 0;
let secCounter = 0;

watch.new('example_back_timer_task', 5000, async () => counter++);
watch.new('second_useless_task', 10000, async () => secCounter++);

watch.on('run', async (key) => (key === "example_back_timer_task") ? await cache.set('example_back_timer_task', counter) : null);
watch.on('run', async (key) => (key === "second_useless_task") ? await cache.set('second_useless_task_counter', secCounter) : null);

cache.set('application_title', 'V_Core_Cache Example');
cache.set('application_description', 'Example Example Description Spaceholder for Cache Cache Cache');
cache.set('application_version', '1.0.0');

module.exports = {
  cache: cache,
  watch: watch,
};