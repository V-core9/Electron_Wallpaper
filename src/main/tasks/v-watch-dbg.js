const { cache, watch } = require('../core');


module.exports = vWatchDebug = async () => {

  const stats = await watch.stats();

  stats.frequency = 1000 / stats.interval;

  stats.tasks = JSON.stringify(await watch.get());

  cache.set("vWatchDBG", stats);

};
