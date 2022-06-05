const { renderCache, dataCache } = require('./caches');

const config = require('../../config');


// Basic Use
const app_info = async () => {
  return `<app_info>
            <h1>${await config.get('title')}</h1>
            <h2>Version: 00.00.00</h2>
          </app_info>`;
};


// Cache with stats

const _cache = async (cacheName, cacheList = {}) => {
  let response = '';

  for (let key in cacheList) {
    response += `<item>${key}: ${JSON.stringify(cacheList[key])}</item>`;
  }

  return `<section name="${cacheName}">
            <actions>
              <button action='listCache'>Refresh</button>
            </actions>
            <group>
              ${response}
            </group>
          </section>`;
};


const cache_stats_box = async (title, vCache) => {
  let stats = await vCache.stats();
  return `<section>
            <header>
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
            </header>
          </section>`;
};


const cache_actions = async () => {
  return `<section>
            <header>
              <h3>Cache Actions:</h3>
              <actions>
                <button action='logUndefinedItem'>Log undefined Item</button>
                <button action='logAllCache'>Log All Cache</button>
                <button action='logStats'>Log Cache Stats</button>
                <button action='purgeCacheStats'>Purge Stats</button>
                <button action='purgeCache'>Purge Cache</button>
              </actions>
            </header>
          </section>`;
};


const listAvailableTasks = async () => {
  let tasksList = await dataCache.get('listAvailableTasks') || {};

  let response = '';

  for (let key in tasksList) {

    response += `<item>${key}: ${JSON.stringify(tasksList[key])}</item>`;
  }

  return `<section>
            <header>
              <h2>Available Tasks List</h2>
              <button action='listAvailableTasks'>Refresh List</button>
            </header>
            <content>
              ${response}
            </content>
          </section>`;
};


const listBackendAllCache = async () => {
  let backCache = await dataCache.get('listBackendAllCache') || {};

  let response = '';

  for (let key in backCache) {

    response += `<item>${key}: ${JSON.stringify(backCache[key])}</item>`;
  }

  return `<section>
            <header>
              <h2>Backend Cache Stats:</h2>
              <button action='listBackendAllCache'>list Backend All Cache</button>
              <button action='purgeBackendCache'>purgeBackendCache</button>
            </header>
            <content>
              ${response}
            </content>
          </section>`;
};



const change_title_form = async () => {
  return `<section>
            <header>
              <h3>Change Application Title:</h3>
            </header>
            <form_group>
              <input type='text' id='customTitle' placeholder='Change Title to Something' value='${await config.get('title')}' />
              <button action='changeAppTitle'>Change</button>
            </form_group>
          </section>`;
};





const testBackendPing = async () => {
  let backPing = await dataCache.get('testBackendPing') || { fb: 0, bf: 0 };
  return `<section>
            <header>
              <h3>Application Test Actions: [ fb:${backPing.fb}, bf:${backPing.bf} ]</h3>
            </header>
            <form_group>
              <button action='testBackendPing'>Test Backend Ping</button>
            </form_group>
          </section>`;
};


const listBackendTasks = async () => {
  let data = await dataCache.get('listBackendTasks') || {};
  log(data);

  let response = '';

  let tasks = data.tasks || [];

  tasks.forEach((task) => {
    response += `<item taskName='${task.name}'>
                    <header>
                      <h4>🆔 ${task.name}</h4>
                      <h5>🚀 Running: ${(task.active ? '✅' : '🟥')}</h5>
                      <h5>➰ Interval: ${task.interval}ms</h5>
                    </header>
                    <actions>
                      <button action='startSpecificTask' ${(task.active ? 'disabled' : '')}>Start</button>
                      <button action='stopSpecificTask' ${(!task.active ? 'disabled' : '')}>Stop</button>
                      <button action='deleteSpecificTask'>Delete</button>
                    </actions>
                  </item>`;
  });

  return `<section class='listBackendTasks'>
            <header>
              <h2>Watch Tasks:</h2>
              <button action='listBackendTasks'>Refresh List</button>
            </header>
            <content>
              ${response}
            </content>
            <footer>
              <h5>Total Tasks: ${data.totalTasksCount}</h5>
              <h5>Active Tasks: ${data.activeTasksCount}</h5>
              <h5>Disabled Tasks: ${data.disabledTasksCount}</h5>
              <button action='endAllTasks'>End All</button>
            </footer>
          </section>`;
};


const app_test_actions = async () => {
  return `${await testBackendPing()}
          ${await listAvailableTasks()}
          ${await listBackendTasks()}
          ${await listBackendAllCache()}`;
};



/*
 * Pages
 */
const pages = {
  home: async () => {
    return `${await listBackendTasks()}`;
  },
  device: async () => {
    return `Welcome, this is just a placeholder for a DEVICE Info Page.`;
  },
  account: async () => {
    return `Welcome, this is just a placeholder for a ACCOUNT Info Page.`;
  },
  settings: async () => {
    return `${await change_title_form()}`;
  },
  debug: async () => {
    return `${await cache_stats_box("dataCache", dataCache)}
            ${await cache_stats_box("renderCache", renderCache)}
            ${await change_title_form()}
            ${await cache_actions()}
            ${await app_test_actions()}`;
  },
};


const renderCurrentPage = async (key) => await pages[key]();


const _header = async () => {
  let currentPage = await dataCache.get('currentPage') || 'home';
  return `<group>
            <button action='openPage' page='home' class='${currentPage === 'home' ? 'active' : ''}'>Home</button>
            <button action='openPage' page='device' class='${currentPage === 'device' ? 'active' : ''}'>Device</button>
            <button action='openPage' page='account' class='${currentPage === 'account' ? 'active' : ''}'>Account</button>
            <button action='openPage' page='settings' class='${currentPage === 'settings' ? 'active' : ''}'>Settings</button>
            ${await config.get('debug') ? ("<button action='openPage' page='debug' " + (currentPage === 'debug' ? ' class=\"active\" ' : '') + ">DebugPage</button>") : ''}
          </group>
          <info>
            <h2>${await config.get('title')}</h2>
          </info>
          <group>
            <button action='minimizeAppToggle'>🔻</button>
            <button action='maximizeAppToggle'>${await config.get('maximized') ? '🔸' : '💢'}</button>
            <button action='exitApplication'>❌</button>
          </group>`;
};

const _footer = async () => {
  return `<group>
            <button action='toggleDebug'>${await config.get('debug') ? 'Disable Debug' : 'Enable Debug'}</button>
          </group>
          <group>
            ${await app_info()}
          </group>
          `;
};

const _content = async () => {
  return `${await renderCurrentPage(await dataCache.get('currentPage') || 'home')}`;
};



const renderApp = async () => {
  return `<header>
            ${await header({})}
          </header>

          <content>
            ${await content({})}
          </content>

          <footer>            
            ${await footer({})}
          </footer>`;
};


const header = async (data) => {
  if (data.key === 'header_render') {
    document.querySelector('v_app header').innerHTML = await renderCache.get("header_render");
    log("HEADER DOM Updated.");
  }
  
  if (data.render === true) {
    await renderCache.set("header_render", await _header(), 16);
    log("HEADER Rendered into Cache.");
  }
};

const content = async (data) => {
  if (data.key === 'content_render') {
    document.querySelector('v_app content').innerHTML = await renderCache.get("content_render");
    log("CONTENT DOM Updated.");
  } 

  if (data.render === true) {
    await renderCache.set("content_render", await _content(), 16);
    log("CONTENT Rendered into Cache.");
  }
};

const footer = async (data) => {
  if (data.key === 'footer_render') {
    document.querySelector('v_app footer').innerHTML = await renderCache.get("footer_render");
    log("FOOTER DOM Updated.");
  }
  
  if (data.render === true) {
    await renderCache.set("footer_render", await _footer(), 16);
    log("FOOTER Rendered into Cache.");
  }
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


module.exports = { app, header, footer, content };