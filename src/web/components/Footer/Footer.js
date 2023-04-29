const path = require("path");

const config = require("../../../config");
const propsToAttribute = require("../../utils/propsToAttribute");
const loadStyleCode = require("../../utils/loadStyleCode");

const Style = require("../Style/Style");


const Footer = async (props = {}) => {
  if (await config.get("debug")) log(`Component [Footer]: `, props);

  const { label, children, options } = props;
  return `${await Style({ cssCode: path.resolve(__dirname, './footer.css') })}
            <footer ${propsToAttribute(options)}>
            ${!label ? (!children ? `` : await children()) : label}
          </footer>`;
};

module.exports = Footer;

