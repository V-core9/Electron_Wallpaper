const { log, info, warn } = require('../helpers/logger');

const { dataCache, renderCache } = require('./core/caches');
const actions = require('./core/actions');

const { header, content, footer, } = require('./core/renders');



// Run the whole thing
(async () => {

  await dataCache.set('currentPage', 'home');

  dataCache.on('set', (data) => header({ render: true }));
  dataCache.on('set', (data) => content({ render: true }));
  dataCache.on('set', (data) => footer({ render: true }));

  renderCache.on('set', header);
  renderCache.on('set', content);
  renderCache.on('set', footer);


  dataCache.on('purge', async () => {
    log('Cache Purged');
    await header({ render: true });
    await content({ render: true });
    await footer({ render: true });
  });


  dataCache.on('purge_stats', async (data) => {
    log('purge_stats CB>>', data);
  });





  window.onload = async () => {
    info('Window Loaded');
  };



  window.addEventListener('click', async (event) => {
    try {
      const action = event.target.getAttribute('action');
      if (action) {
        actions[action](event);
      }
    } catch (error) {
      warn(error);
    }
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





  actions.getConfig();

  actions.listAvailableTasks();
  actions.listBackendTasks();
  actions.listBackendAllCache();

})();
