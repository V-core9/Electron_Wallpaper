const config = require("../../../../config");

const props_to_attribute = require("../../../utils/props_to_attribute");

const Style = async (props = {}) => {
  if (await config.get("debug")) log(`Component [Style]: `, props);

  const { cssCode, options } = props;
  return !cssCode
    ? log("Style Component missing [cssCode] prop")
    : `<style ${props_to_attribute(options)}>${cssCode}</style>`;
};

module.exports = Style;
