const log = require('./helpers/log');

const { dataCache, renderCache } = require('./render/caches');
const actions = require('./render/actions');

const { app } = require('./render/app');



// Run the whole thing
(async () => {

  dataCache.on('set', app);
  renderCache.on('set', app);


  dataCache.on('purge', async () => {
    log('Cache Purged');
    await app({});
  });


  dataCache.on('purge_stats', async (data) => {
    log('purge_stats CB>>', data);
  });


  window.onclick = async (event) => {
    let action = event.target.getAttribute('action');
    if (actions[action] !== undefined) {
      await actions[action](event);
    }
  };


  await dataCache.set('application_title', 'V_Core_Cache Example');
  await dataCache.set('application_version', '1.0.0');


  debug = true;


  log("Data Cache: ", await dataCache.getAll());
  log("Render Cache: ", await renderCache.getAll());


  actions.listAvailableTasks();
  actions.listBackendTasks();
  actions.listBackendAllCache();


})();
