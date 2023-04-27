const config = require('../../config');
const { dataCache } = require('../core/caches');
const  NavMain = require('./NavMain');

module.exports = async () => {

  let currentPage = await dataCache.get('currentPage') || 'home';

  return `<group>
            ${await NavMain()}
          </group>
          <info>
            <h2>${await config.get('title') || 'Missing Application Title'}</h2>
          </info>
          <group>
            <button action='openPage' page='settings' class='${currentPage === 'settings' ? 'active' : ''}'>🔨</button>
            <button action='minimizeAppToggle'>🔻</button>
            <button action='maximizeAppToggle'>${await config.get('maximized') ? '🔸' : '💢'}</button>
            <button action='exitApplication'>❌</button>
          </group>`;
};