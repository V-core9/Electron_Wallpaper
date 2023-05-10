const path = require("path");
const { BCC } = require("../../../utils/base_component_create");

const Header = BCC({
  htmlElemName: "header",
  cssPath: path.resolve(__dirname, "./header.css"),
});

module.exports = Header;
