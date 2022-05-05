
const verify = require('./_');

(async () => {

  //? Weather API Key Validator Function
  await verify.register('weatherApiKey', require('./weatherApiKey'));

  await verify.register('positiveInteger', require('./positiveInteger'));
})();

module.exports = verify;
