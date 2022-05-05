
const verify = require('./_');

(async () => {

  //? Weather API Key Validator Function
  await verify.register('weatherApiKey', require('./weatherApiKey'));


})();

module.exports = verify;
