const log = require('./helpers/log');

const { dataCache, renderCache } = require('./render/caches');
const actions = require('./render/actions');

const { renderApp } = require('./render/app');


const app = async (data) => {
  let startTime = Date.now();
  let happened = 'App Render Cache Update';
  if (data.key === 'appRender') {
    happened = 'App DOM Update';
    document.querySelector('v_app').innerHTML = await renderCache.get("appRender");
  } else {
    await renderCache.set("appRender", await renderApp(), 16);
  }
  let endTime = Date.now() - startTime;
  log(`${happened} in ${endTime}ms`);
};



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
})();
