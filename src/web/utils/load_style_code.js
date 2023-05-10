const fs = require("fs");

const load_style_code = (filePath = null) => {
  try {
    const style = fs.readFileSync(filePath);
    return style;
  } catch (error) {
    warn(error);
    return null;
  }
};

module.exports = load_style_code;
