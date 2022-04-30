const { cache, watch } = require('../core');


module.exports = vWatchDebug = async () => {

  let stats = await watch.stats();

  stats.frequency = 1000 / stats.interval;

  stats.tasks = await watch.getAll();

  cache.set("vWatchDBG", stats);

};
