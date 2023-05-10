const path = require("path");

const config = require("../../../config");
const propsToAttribute = require("../../utils/propsToAttribute");
const loadStyleCode = require("../../utils/loadStyleCode");

const Style = require("../Style/Style");
const cssCode = loadStyleCode(path.resolve(__dirname, "./content.css"));

const Content = async (props = {}) => {
  if (await config.get("debug")) log(`Component [Content]: `, props);

  const { label, children, options } = props;
  return `${!cssCode ? `` : await Style({ cssCode })}
            <content ${propsToAttribute(options)}>
            ${!label ? (!children ? `` : await children()) : label}
          </content>`;
};

module.exports = Content;

