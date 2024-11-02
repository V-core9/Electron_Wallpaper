const config = require('../../../config')
const { dataCache, cPaths } = require('../../core/caches')

//*--------------------------------------------
//? Name: simpleDeepCopy
//* Desc: Simple Deep Copy function using only JSON
//! Conc: Will probably keep as simplest solution.

const simpleDeepCopy = (object) => JSON.parse(JSON.stringify(object))

//!---------------------------------------------

const navConfig = [
  {
    page: 'Home',
    label: '🚇 Dashboard',
  },
  {
    page: 'Theme',
    label: '🎨 Theme',
  },
  {
    page: 'Account',
    label: '👷‍♂️ Account',
  },
  {
    page: 'Domains',
    label: '📦 Domains',
  },
]

const NavMain = async () => {
  let currentPage = (await dataCache.get(cPaths.currentPage)) || navConfig[0].page

  const primaryNavigation = simpleDeepCopy(navConfig)
  if (await config.get('debug')) primaryNavigation.push({ page: 'Debug', label: '👨‍💻 Debug' })

  return primaryNavigation
    .map(
      (i) =>
        `<button action='openPage' page='${i.page}' class='${currentPage === i.page ? 'active' : ''}'>${
          i.label
        }</button>`
    )
    .join('')
}

module.exports = NavMain
