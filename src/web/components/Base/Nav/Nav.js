const path = require("path");
const { BCC } = require("../../../utils/base_component_create");

const Nav = BCC({
  htmlElemName: "nav",
  cssPath: path.resolve(__dirname, "./nav.css"),
});

module.exports = Nav;
