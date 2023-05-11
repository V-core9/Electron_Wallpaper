const appInfo = require('../view/appInfo')

const Footer = async () => {
  return `<group>
            ${await appInfo()}
          </group>
          <group>
            ${await appInfo()}
          </group>
          `
}

module.exports = Footer
