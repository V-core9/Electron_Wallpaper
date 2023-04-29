// Utils
const createNewPage = require("../utils/createNewPage");

// Components
const { ListBackendTasks } = require("../components");

const PageRender = async () => {
  return `${await ListBackendTasks()}`;
};

// Create Page using PageRender and some config options
const HomePage = createNewPage({
  render: PageRender,
  layout: "baseLayout",
  description: "Root Page Example",
});

module.exports = HomePage;
