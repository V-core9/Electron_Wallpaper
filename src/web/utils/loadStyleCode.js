const fs = require("fs");

const loadStyleCode = (filePath = null) => {
  try {
    const styleCode = fs.readFileSync(filePath);
    return styleCode;
  } catch (error) {
    warn(error);
    return null;
  }
};

module.exports = loadStyleCode;

