
const verify = require('v_rifier');

(async () => {

  await verify.loadBuiltIns();

  //* Just listing the types once set.
  const { log } = require('../logger');
  log(" verify.loadBuiltIns() ", await verify.listTypes());

})();

module.exports = verify;
