const { Notification } = require('electron');


const NOTIFICATION_TITLE = 'Basic Notification';
const NOTIFICATION_BODY = 'Notification from the Main process';

const notify = {

  exampleNotification: async () => {
    new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show();
  },


};

module.exports = notify;