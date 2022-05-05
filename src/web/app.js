const { log, info, warn } = require('../helpers/logger');

const { dataCache, renderCache } = require('./core/caches');
const actions = require('./core/actions');

const { app } = require('./core/renders');
const config = require('../config');



// Run the whole thing
(async () => {

  await dataCache.set('currentPage', 'home');

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
    await actions.isMaximized();
  });

  window.addEventListener('blur', actions.windowBlur);

  window.addEventListener('focus', actions.windowFocus);

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
