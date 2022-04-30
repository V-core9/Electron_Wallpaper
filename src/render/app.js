const { renderCache, dataCache } = require('./caches');

// Basic Use
const app_info = async () => {
  return `<app_info>
            <h1>${await dataCache.get('application_title')}</h1>
            <h2>Version: ${await dataCache.get('application_version')}</h2>
          </app_info>`;
};

// Cache with stats

const _cache = async (cacheName, cacheList = {}) => {
  let response = '';

  for (let key in cacheList) {
    response += `<item>${key}: ${JSON.stringify(cacheList[key])}</item>`;
  }

  return `<cache_listing name="${cacheName}">
            <actions>
              <button action='listCache'>Refresh</button>
            </actions>
            <group>
              ${response}
            </group>
          </cache_listing>`;
};

const cache_stats_box = async (title, vCache) => {
  let stats = await vCache.stats();
  return `<cache_stats_box>
            <h3>${title}:</h3>
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

const listBackendAllCache = async () => {
  let backCache = await dataCache.get('listBackendAllCache') || {};

  let response = '';

  for (let key in backCache) {

    response += `<item>${key}: ${JSON.stringify(backCache[key])}</item>`;
  }

  return `<cache_actions>
            <button action='listBackendAllCache'>list Backend All Cache</button>
            <button action='purgeBackendCache'>purgeBackendCache</button>
            <group>
              ${response}
            </group>
          </cache_actions>`;
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
    response += `<item taskName='${tasks[key]}'>
                    <h4>${tasks[key]}</h4>
                    <actions>
                      <button action='startSpecificTask'>Start</button>
                      <button action='stopSpecificTask'>Stop</button>
                      <button action='deleteSpecificTask'>Delete</button>
                    </actions>
                  </item>`;
  }

  return `<tasks_listing>
            <actions>
              <button action='listBackendTasks'>Refresh List</button>
              <button action='endAllTasks'>End All</button>
            </actions>
            <group>
              ${response}
            </group>
          </tasks_listing>`;
};


const app_test_actions = async () => {
  return `${await testBackendPing()}
          ${await listBackendTasks()}
          ${await listBackendAllCache()}`;
};



const _header = async () => {
  return `<header>
            <group>
              <button action='toggleDebug'>Toggle Debug</button>
            </group>
            <info>
              <h2>${await dataCache.get('application_title')} : Version: ${await dataCache.get('application_version')}</h2>
            </info>
            <group>
              <button action='minimizeAppToggle'>🔻</button>
              <button action='maximizeAppToggle'>💢</button>
              <button action='exitApplication'>❌</button>
            </group>
          </header>`;
};

const _footer = async () => {
  return `<footer>
            <group>
              ${await app_info()}
            </group>
            <group>
              ${await app_info()}
            </group>
          </footer>`;
};

const _content = async () => {
  return `<content>
            ${await cache_stats_box("dataCache", dataCache)}
            ${await cache_stats_box("renderCache", renderCache)}
            ${await change_title_form()}
            ${await change_version_form()}
            ${await cache_actions()}
            ${await app_test_actions()}
          </content>`;
};



const renderApp = async () => {
  return `${await _header()}
          ${await _content()}
          ${await _footer()}`;
};

module.exports = { renderApp };