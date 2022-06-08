const change_title_form = require('../view/change_title_form');
const app_debug_toggle = require('../view/app_debug_toggle');
const notifications_toggle = require('../view/notifications_toggle');

module.exports = async () => {
  return `${await change_title_form()}
          ${await notifications_toggle()}
          ${await app_debug_toggle()}`;
};