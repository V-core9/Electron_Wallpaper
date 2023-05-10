// Utils
const { create_new_page } = require("../utils");
// Layout
const SimplePageLayout = require("../components/Layouts/SimplePageLayout/SimplePageLayout");
// Components
const { ListBackendTasks } = require("../components/Custom");
const {
  cache_stats_box,
  change_title_form,
  cache_actions,
  testBackendPing,
  listAvailableTasks,
  listBackendAllCache,
  app_debug_toggle,
  app_ip_address,
  app_check_local_ports,
} = require("../components/view");

const Page = {
  children: async () => `${await cache_stats_box("dataCache", dataCache)}
                        ${await cache_stats_box("renderCache", renderCache)}
                        ${await app_ip_address()}
                        ${await app_debug_toggle()}
                        ${await app_check_local_ports()}
                        ${await change_title_form()}
                        ${await cache_actions()}
                        ${await testBackendPing()}
                        ${await listAvailableTasks()}
                        ${await ListBackendTasks()}
                        ${await listBackendAllCache()}`,
};

// Create Page using PageRender and some config options
const Debug = create_new_page({
  title: "Debug",
  description: "Debug Page Example",
  render: async () => `${await SimplePageLayout(Page)}`,
});

module.exports = Debug;
