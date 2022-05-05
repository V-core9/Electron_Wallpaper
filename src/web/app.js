const { log, info, warn } = require('../helpers/logger');

const { dataCache, renderCache } = require('./core/caches');
const actions = require('./core/actions');

const { app } = require('./core/renders');



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





  window.onload = async () => {
    info('Window Loaded');
  };



  window.addEventListener('click', async (event) => {
    let action = event.target.getAttribute('action');
    if (action === undefined) return false;

    if (actions[action] !== undefined) {
      await actions[action](event);
      return true;
    }

    return false;
  });



  window.addEventListener('resize', async (event) => {
    log('Resize Event', event);
  });

  window.addEventListener('blur', async (event) => {
    warn('Blur Event', event);
  });

  window.addEventListener('focus', async (event) => {
    info('Focus Event', event);
  });

  window.addEventListener('beforeunload', async (event) => {
    warn('Yea BeforeUnload Alert', event);
  });

  window.addEventListener('unload', async (event) => {
    warn('Yea Unload Alert', event);
  });





  actions.listAvailableTasks();
  actions.listBackendTasks();
  actions.listBackendAllCache();


})();
