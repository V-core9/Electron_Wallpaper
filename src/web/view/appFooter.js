const config = require('../../config');
const appInfo = require('./appInfo');
const app_debug_toggle = require('./app_debug_toggle');


module.exports = async () => {
  return `<group>
            ${await appInfo()}
          </group>
          <group>
            ${await appInfo()}
          </group>
          `;
};