const change_title_form = require('../view/change_title_form');
const app_debug_toggle = require('../view/app_debug_toggle');

module.exports = async () => {
  return `${await change_title_form()}
          ${await app_debug_toggle()}`;
};