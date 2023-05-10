const config = require("../../config");

const props_to_attribute = require("./props_to_attribute");
const load_style_code = require("./load_style_code");
const Style = require("../components/Base/Style/Style");

const base_component_create = ({ htmlElemName, cssPath }) => {
  const debug = config.getSy("debug");

  //* BASE Component Renderer Function
  let component = async (props = {}) => {
    const cssCode = load_style_code(cssPath);
    const { label, children, options } = props;
    return `${!cssCode ? `` : await Style({ cssCode })}
              <${htmlElemName} ${props_to_attribute(options)}>
              ${!label ? (!children ? `` : await children()) : label}
            </${htmlElemName}>`;
  };
  //! BASE Component Renderer Function
  if (debug) {
    component = new Function(
      "props = {}",
      `debug && log(\`Component [${htmlElemName}]: \`, props);\n
      ${component.toString()}`
    );
  }

  return component;
};

const BCC = base_component_create;

module.exports = {
  base_component_create,
  BCC,
};
