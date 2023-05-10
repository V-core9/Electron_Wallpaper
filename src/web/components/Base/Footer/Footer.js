const path = require("path");

const config = require("../../../../config");

const props_to_attribute = require("../../../utils/props_to_attribute");
const load_style_code = require("../../../utils/load_style_code");

const Style = require("../Style/Style");

const Footer = async (props = {}) => {
  if (await config.get("debug")) log(`Component [Footer]: `, props);

  const { label, children, options } = props;
  return `${await Style({
    cssCode: load_style_code(path.resolve(__dirname, "./footer.css")),
  })}
            <footer ${props_to_attribute(options)}>
            ${!label ? (!children ? `` : await children()) : label}
          </footer>`;
};

module.exports = Footer;
