const path = require("path");
const { BCC } = require("../../../utils/base_component_create");

const Content = BCC({
  htmlElemName: "content",
  cssPath: path.resolve(__dirname, "./content.css"),
});

module.exports = Content;
