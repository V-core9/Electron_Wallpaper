
const verify = require('v_rifier');

(async () => {

  await verify.loadBuiltIns();

  await verify.register('weatherApiKey', async (val) => (await verify.isString(val) && (val.length === 32)));

  const log = require('../helpers/logger');
  log(" verify.loadBuiltIns() ", await verify.listTypes());

})();

module.exports = verify;