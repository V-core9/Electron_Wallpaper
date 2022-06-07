const config = require('../../config');

module.exports = async () => {
  let debug = await config.get('debug');

  return `<section class='app_debug_toggle'>
            <content class='flex-row'>
              <h3>Debug Mode: ${debug ? 'Enabled' : 'Disabled'}</h3>
              <button action='toggleDebug'>${debug ? 'Disable Debug' : 'Enable Debug'}</button>
            </content>
          </section>`;
};