const cache_stats_box = require("../view/cache_stats_box");
const change_title_form = require("../view/change_title_form");
const cache_actions = require("../view/cache_actions");
const listBackendTasks = require("../components/ListBackendTasks/ListBackendTasks");
const testBackendPing = require("../view/testBackendPing");
const listAvailableTasks = require("../view/listAvailableTasks");
const listBackendAllCache = require("../view/listBackendAllCache");
const app_debug_toggle = require("../view/app_debug_toggle");
const app_ip_address = require("../view/app_ip_address");
const app_check_local_ports = require("../view/app_check_local_ports");

module.exports = async () => {
  return `${await cache_stats_box("dataCache", dataCache)}
          ${await cache_stats_box("renderCache", renderCache)}
          ${await app_ip_address()}
          ${await app_debug_toggle()}
          ${await app_check_local_ports()}
          ${await change_title_form()}
          ${await cache_actions()}
          ${await testBackendPing()}
          ${await listAvailableTasks()}
          ${await listBackendTasks()}
          ${await listBackendAllCache()}`;
};
