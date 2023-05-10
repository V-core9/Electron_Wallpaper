const config = require("../../../config");
const propsToAttribute = require("../../utils/propsToAttribute");

const Style = async (props = {}) => {
  if (await config.get("debug")) log(`Component [Style]: `, props);

  const { cssCode, options } = props;
  return !cssCode
    ? log("Style Component missing [cssCode] prop")
    : `<style ${propsToAttribute(options)}>${cssCode}</style>`;
};

module.exports = Style;

