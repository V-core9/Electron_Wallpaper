const config = require('../../config');
const { dataCache } = require('../core/caches');

const NavMain = async () => { 

  let currentPage = await dataCache.get('currentPage') || 'home';

  const primaryNavigation = [
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

  if (await config.get('debug')) primaryNavigation.push({page:'debug', label: '👨‍💻 Debug'})

  return primaryNavigation.map((i) => `<button action='openPage' page='${i.page}' class='${currentPage === i.page ? 'active' : ''}'>${i.label}</button>`).join('')
}

module.exports = NavMain;
