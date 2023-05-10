const path = require("path");
const config = require("../../../config");
const { BCC } = require("../../utils/base_component_create");

const Header = BCC({
  htmlElemName: "header",
  debug: config.getSy("debug"),
  cssPath: path.resolve(__dirname, './header.css'),
});

module.exports = Header;
