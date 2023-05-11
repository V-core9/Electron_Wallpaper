const config = require('../../config')

module.exports = async () => {
  let minimizeToTray = await config.get('minimizeToTray')

  return `<section class='app_minimizeToTray_toggle'>
            <header>
              <h3>🔻 Minimize To Tray on Close</h3>
            </header>
            <content class='flex-row'>
              <item>
                <h3>Status: ${
                  minimizeToTray ? '✅ Enabled' : '🟥 Disabled'
                }</h3>
                <button action='toggleMinimizeToTray'>${
                  minimizeToTray ? '❌ Disable' : '🚀 Enable'
                }</button>
              </item>
            </content>
          </section>`
}
