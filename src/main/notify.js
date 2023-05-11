const { Notification } = require('electron')
const config = require('../config')

async function maybeNotify(data = {}) {
  return (await config.get('notify'))
    ? new Notification({
        title: data.title || 'missing title',
        body: data.body || 'missing body',
      }).show()
    : null
}

const notify = {
  exampleNotification: async () =>
    maybeNotify({
      title: 'Basic Notification',
      body: 'Notification from the Main process',
    }),

  minimizeToTray: async () =>
    maybeNotify({ title: 'Application To Tray', body: 'Why did it not exit?' }),

  appExiting: async () =>
    maybeNotify({
      title: 'Application Exiting',
      body: 'Processing Exit Request',
    }),
}

module.exports = notify
