// Utils
const createNewPage = require("../utils/createNewPage");

// Components
const { ListBackendTasks } = require("../components");


// Create Page using PageRender and some config options
const Home = createNewPage({
  render: async () => `${await ListBackendTasks()}`,
  layout: "base_layout_001",
  description: "Root Page Example",
});

module.exports = Home;
