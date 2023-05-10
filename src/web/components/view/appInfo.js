const config = require("../../../config");

// Basic Use
module.exports = async () => {
  return `<app_info>
            <h1>${await config.get("title")}</h1>
            <h2>Version: ${await config.get("version")}</h2>
          </app_info>`;
};
