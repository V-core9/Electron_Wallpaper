const config = require('../../config');
const { dataCache } = require('../core/caches');


module.exports = async ({ primary, secondary }) => {

  const prim = [
    {
      page: 'home',
      label: '🚇 Dashboard'
    },
    {
      page: 'theme',
      label: '🎨 Theme'
    },
    {
      page: 'account',
      label: '👷‍♂️ Account'
    },
    {
      page: 'domains',
      label: '📦 Domains'
    },
  ]

  if (await config.get('debug')) prim.push({page:'debug', label: '👨‍💻 Debug'})

  let currentPage = await dataCache.get('currentPage') || 'home';

  return `<group>
            ${prim.map((i) => `<button action='openPage' page='${i.page}' class='${currentPage === i.page ? 'active' : ''}'>${i.label}</button>`).join('')}
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