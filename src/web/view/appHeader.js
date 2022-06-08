const config = require('../../config');
const { dataCache } = require('../core/caches');

module.exports = async () => {
  let currentPage = await dataCache.get('currentPage') || 'home';
  return `<group>
            <button action='openPage' page='home' class='${currentPage === 'home' ? 'active' : ''}'>🚇 Dashboard</button>
            <button action='openPage' page='device' class='${currentPage === 'device' ? 'active' : ''}'>📑 Device</button>
            <button action='openPage' page='account' class='${currentPage === 'account' ? 'active' : ''}'>👷‍♂️ Account</button>
            ${await config.get('debug') ? ("<button action='openPage' page='debug' " + (currentPage === 'debug' ? ' class=\"active\" ' : '') + ">👨‍💻 Debug</button>") : ''}
          </group>
          <info>
            <h2>${await config.get('title')}</h2>
          </info>
          <group>
            <button action='openPage' page='settings' class='${currentPage === 'settings' ? 'active' : ''}'>🔨</button>
            <button action='minimizeAppToggle'>🔻</button>
            <button action='maximizeAppToggle'>${await config.get('maximized') ? '🔸' : '💢'}</button>
            <button action='exitApplication'>❌</button>
          </group>`;
};