const path = require("path");
const { BCC } = require("../../../utils/base_component_create");

const Section = BCC({
  htmlElemName: "section",
  cssPath: path.resolve(__dirname, "./section.css"),
});

module.exports = Section;
