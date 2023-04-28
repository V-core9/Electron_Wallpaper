// Utils
const createNewPage = require("../utils/createNewPage");

// Components
const Section = require("../components/Section/Section");
const listBackendTasks = require("../view/listBackendTasks");

//? PAGE CONTENT
const section = {
  children: async () => {
    return `${await listBackendTasks()}`;
  },
  options: {
    classes: ["listBackendTasks"],
    style: "color: orange;",
  },
};

const PageRender = async () => {
  return `${await Section(section)}`;
};

// Create Page using PageRender and some config options
const HomePage = createNewPage({
  render: PageRender,
  layout: "baseLayout",
  description: "Root Page Example",
});

module.exports = HomePage;
