// Utils
const { create_new_page } = require("../utils");
// Layout
const SimplePageLayout = require("../components/Layouts/SimplePageLayout/SimplePageLayout");
// Components
const { ListBackendTasks } = require("../components/Custom");

const Page = {
  children: async () => `${await ListBackendTasks()}`,
};

// Create Page using PageRender and some config options
const Home = create_new_page({
  title: "Home",
  description: "Root Page Example",
  render: async () => `${await SimplePageLayout(Page)}`
});

module.exports = Home;
