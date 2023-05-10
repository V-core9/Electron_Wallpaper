const config = require("../../../config");
const propsToAttribute = require("../../utils/propsToAttribute");

const Button = async (props = {}) => {
  if (await config.get("debug")) log(`Component [Button]: `, props);

  const { label, children, options } = props;
  return `<button ${propsToAttribute(options)}>
            ${!label ? await children() : label}
          </button>`;
};

module.exports = Button;

