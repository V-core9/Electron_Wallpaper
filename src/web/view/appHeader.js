const config = require('../../config');
const { dataCache } = require('../core/caches');

module.exports = async () => {
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