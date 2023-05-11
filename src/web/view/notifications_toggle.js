const config = require('../../config')

module.exports = async () => {
  let notify = await config.get('notify')

  return `<section class='notifications_toggle'>
            <header>
              <h3>🎉 Notifications Settings</h3>
            </header>
            <content class='flex-row'>
              <item>
                <h3>Display OS Notifications: ${notify ? 'Enabled' : 'Disabled'}</h3>
                <button action='toggleNotifications'>${notify ? 'Disable' : 'Enable'}</button>
              </item>
            </content>
          </section>`
}
