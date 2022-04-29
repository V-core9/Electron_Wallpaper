const { ipcRenderer } = require('electron')



const V_Core_Cache = require('v_core_cache');
const dataCache = new V_Core_Cache();

const renderCache = new V_Core_Cache();

// Debug and Logging
let debug = false;

const log = async (...args) => {
  if (debug) {
    console.log(...args);
  }
};



// Example Application
const actions = {
  changeAppVersion: async () => await dataCache.set('application_version', document.querySelector('#customVersion').value),
  changeAppTitle: async () => await dataCache.set('application_title', document.querySelector('#customTitle').value),
  logStats: async () => log(await dataCache.stats()),
  purgeCache: async () => await dataCache.purge(),
  purgeCacheStats: async () => await dataCache.purgeStats(),
  logAllCache: async () => log(await dataCache.getAll()),
  logUndefinedItem: async () => log(await dataCache.get('logUndefinedItem')),

  testBackendPing: async () => {
    const beforeTime = Date.now();
    const rez = await ipcRenderer.invoke('ping', beforeTime);
    const afterTime = Date.now();
    log(rez);
    await dataCache.set('testBackendPing', { fb: rez - beforeTime, bf: afterTime - rez });
  },

  listBackendTasks: async () => {
    await dataCache.set('listBackendTasks', JSON.parse(await ipcRenderer.invoke('listBackendTasks')));
  },

  listBackendAllCache: async () =>{
    await dataCache.set('listBackendAllCache', JSON.parse(await ipcRenderer.invoke('listBackendAllCache')));
  }
};


const cache_stats_box = async () => {
  let stats = await dataCache.stats();
  return `<cache_stats_box>
            <h3>Cache Stats:</h3>
            <div>
              <h5>Hits:</h5>
              <p>${stats.hits}</p>
            </div>
            <div>
              <h5>Misses:</h5>
              <p>${stats.misses}</p>
            </div>
            <div>
              <h5>Count:</h5>
              <p>${stats.count}</p>
            </div>
            <div>
              <h5>Size:</h5>
              <p>${stats.size}</p>
            </div>
          </cache_stats_box>`;
};


const app_info = async () => {
  return `<app_info>
            <h1>${await dataCache.get('application_title')}</h1>
            <h2>Version: ${await dataCache.get('application_version')}</h2>
          </app_info>`;
};

const change_title_form = async () => {
  return `<change_title_form>
            <h3>Change Application Title:</h3>
            <form_group>
              <input type='text' id='customTitle' placeholder='Change Title to Something' value='${await dataCache.get('application_title')}' />
              <button action='changeAppTitle'>Change</button>
            </form_group>
          </change_title_form>`;
};

const change_version_form = async () => {
  return `<change_version_form>
            <h3>Change Application Version:</h3>
            <form_group>
              <input type='text' id='customVersion' placeholder='Change Title to Something' value='${await dataCache.get('application_version')}' />
              <button action='changeAppVersion'>Change</button>
            </form_group>
          </change_version_form>`;
};

const cache_actions = async () => {
  return `<cache_actions>
            <h3>Cache Actions:</h3>
            <form_group>
              <button action='logUndefinedItem'>Log undefined Item</button>
              <button action='logAllCache'>Log All Cache</button>
              <button action='logStats'>Log Cache Stats</button>
              <button action='purgeCacheStats'>Purge Stats</button>
              <button action='purgeCache'>Purge Cache</button>
            </form_group>
          </cache_actions>`;
};

const testBackendPing = async () => {
  let backPing = await dataCache.get('testBackendPing') || { fb: 0, bf: 0 };
  return `<cache_actions>
            <h3>Application Test Actions: [ fb:${backPing.fb}, bf:${backPing.bf} ]</h3>
            <form_group>
              <button action='testBackendPing'>Test Backend Ping</button>
            </form_group>
          </cache_actions>`;
};

const listBackendTasks = async () => {
  let tasks = await dataCache.get('listBackendTasks') || {};

  let response = '';

  for (let key in tasks) {

    response += `<item>${key}: ${JSON.stringify(tasks[key])}</item>`;
  }

  return `<cache_actions>
            <button action='listBackendTasks'>listBackendTasks</button>
            <group>
              ${response}
            </group>
          </cache_actions>`;
};

const listBackendAllCache = async () => {
  let backCache = await dataCache.get('listBackendAllCache') || {};

  let response = '';

  for (let key in backCache) {

    response += `<item>${key}: ${JSON.stringify(backCache[key])}</item>`;
  }

  return `<cache_actions>
            <button action='listBackendAllCache'>list Backend All Cache</button>
            <group>
              ${response}
            </group>
          </cache_actions>`;
};

const app_test_actions = async () => {
  return `${await testBackendPing()}
          ${await listBackendTasks()}
          ${await listBackendAllCache()}`;
};

const renderApp = async () => {
  return `${await cache_stats_box()}
          ${await change_title_form()}
          ${await change_version_form()}
          ${await cache_actions()}
          ${await app_test_actions()}
          ${await app_info()}`;
};

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
      await actions[action]();
    }
  };

  await dataCache.set('application_title', 'V_Core_Cache Example');
  await dataCache.set('application_version', '1.0.0');

  debug = true;

  log("Data Cache: ", await dataCache.getAll());
  log("Render Cache: ", await renderCache.getAll());
})();
