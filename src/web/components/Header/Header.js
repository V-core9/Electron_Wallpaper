const path = require("path");

const config = require("../../../config");
const propsToAttribute = require("../../utils/propsToAttribute");
const loadStyleCode = require("../../utils/loadStyleCode");

const Style = require("../Style/Style");

const Header = async (props = {}) => {
  if (await config.get("debug")) log(`Component [Header]: `, props);

  const { label, children, options } = props;
  return `${await Style({ cssCode: loadStyleCode(path.resolve(__dirname, './header.css')) })}
            <header ${propsToAttribute(options)}>
            ${!label ? (!children ? `` : await children()) : label}
          </header>`;
};

module.exports = Header;

