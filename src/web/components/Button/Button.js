const config = require("../../../config");

const Button = async (props = {}) => {
  if (await config.get("debug")) log(`Component [Button]: `, props);

  const { label, children, action, options } = props;
  return `<button class='${options?.classes?.join(' ')}' style='${options?.style}' action='${action}'>
            ${!label ? await children() : label}
          </button>`;
};

module.exports = Button;

