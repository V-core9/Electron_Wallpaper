const path = require("path");
const { BCC } = require("../../../utils/base_component_create");

const Button = BCC({
  htmlElemName: "button",
  cssPath: path.resolve(__dirname, "./button.css"),
});

module.exports = Button;
