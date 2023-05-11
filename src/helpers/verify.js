const verify = require('v_rifier')()

//? Weather API Key Validator Function
verify.register('weatherApiKey', async (v) => (await verify.isString(v)) && v.length === 32)

//? Positive Integer
//* Width / Height in px
verify.register('positiveInteger', async (v) => (await verify.isInteger(v)) && v > -1)

module.exports = verify
