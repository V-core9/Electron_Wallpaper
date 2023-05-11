const screenshot = require('screenshot-desktop')
const path = require('path')
const { log } = require('../../helpers/logger')

module.exports = screenshotDesktop = async () => {
  try {
    await screenshot({
      format: 'png',
      filename: path.join(
        __dirname,
        '../../temp/screenshots/desktop_' + Date.now() + '.png'
      ),
    })
    return true
  } catch (error) {
    log(error)
    return false
  }
}
