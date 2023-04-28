const change_title_form = require("../view/change_title_form");
const app_debug_toggle = require("../view/app_debug_toggle");
const notifications_toggle = require("../view/notifications_toggle");
const minimizeToTray_toggle = require("../view/option_minimizeToTray_toggle");

const SettingsPage = async () => {
  return `${await change_title_form()}
          ${await minimizeToTray_toggle()}
          ${await notifications_toggle()}
          ${await app_debug_toggle()}`;
};

SettingsPage.layout = "base_dashboard_layout";

module.exports = SettingsPage;
