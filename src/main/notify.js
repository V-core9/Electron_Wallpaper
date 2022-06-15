const { Notification } = require('electron');
const config = require('../config');

const NOTIFICATION_TITLE = 'Basic Notification';
const NOTIFICATION_BODY = 'Notification from the Main process';

const notify = {

  exampleNotification: async () => (await config.get('notify')) ? new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show() : null,

  minimizeToTray: async () => (await config.get('notify')) ? new Notification({ title: "Application To Tray", body: "Why did it not exit?" }).show() : null,

  appExiting: async () => (await config.get('notify')) ? new Notification({ title: "Application Exiting", body: "Processing Exit Request" }).show() : null,
};

module.exports = notify;