// Utils
const { create_new_page } = require("../utils");
// Layout
const SimplePageLayout = require("../components/Layouts/SimplePageLayout/SimplePageLayout");
// Components
const {
  change_title_form,
  app_debug_toggle,
  notifications_toggle,
  MinimizeToTrayToggle,
} = require("../components/view");

const Page = {
  children: async () => `${await change_title_form()}
                        ${await MinimizeToTrayToggle()}
                        ${await notifications_toggle()}
                        ${await app_debug_toggle()}`,
};

// Create Page using PageRender and some config options
const Settings = create_new_page({
  title: "Settings",
  description: "Settings description",
  render: async () => `${await SimplePageLayout(Page)}`,
});

module.exports = Settings;
