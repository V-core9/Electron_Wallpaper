const config = require('../../../config');
const { dataCache } = require('../../core/caches');

//*--------------------------------------------
//? Name: simpleDeepCopy
//* Desc: Simple Deep Copy function using only JSON 
//! Conc: Will probably keep as simplest solution.

const simpleDeepCopy = (object) => JSON.parse(JSON.stringify(object));

//!---------------------------------------------

const navConfig = [
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
];

const NavMain = async () => { 
  let currentPage = await dataCache.get('currentPage') || 'home';

  const primaryNavigation = simpleDeepCopy(navConfig);
  if (await config.get('debug')) primaryNavigation.push({page:'debug', label: '👨‍💻 Debug'})

  return primaryNavigation.map((i) => `<button action='openPage' page='${i.page}' class='${currentPage === i.page ? 'active' : ''}'>${i.label}</button>`).join('')
}

module.exports = NavMain;
