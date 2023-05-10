const { appInfo } = require("../../view");

const Footer_Default = async () => {
  return `<group>
            ${await appInfo()}
          </group>
          <group>
            ${await appInfo()}
          </group>
          `;
};

module.exports = Footer_Default;
