const config = require('../../config')
const { dataCache, cPaths } = require('../core/caches')
const { NavMain } = require('../components')
const Button = require('../components/Button/Button')

let minimizeAppToggle = null
let exitApp = null

const openSettings = async () =>
  await Button({
    label: `🔨`,
    options: {
      action: `openPage`,
      classes: [((await dataCache.get(cPaths.currentPage)) || 'home') === 'Settings' ? 'active' : ''],
      custom_attr: [{ key: 'page', val: 'Settings' }],
    },
  })

const maximizeAppToggle = async () =>
  await Button({
    label: (await config.get('maximized')) ? '🔸' : '💢',
    options: {
      action: `maximizeAppToggle`,
    },
  })

const Header = async () => {
  if (!minimizeAppToggle)
    minimizeAppToggle = await Button({
      label: `🔻`,
      options: {
        action: `minimizeAppToggle`,
      },
    })

  if (!exitApp)
    exitApp = await Button({
      label: '❌',
      options: {
        action: `application/command/exit`,
      },
    })

  return `<group>
            ${await NavMain()}
          </group>
          <info>
            <h2>${(await config.get('title')) || 'Missing Application Title'}</h2>
          </info>
          <group>
            ${await openSettings()}
            ${minimizeAppToggle}
            ${await maximizeAppToggle()}
            ${exitApp}
          </group>`
}

module.exports = Header
