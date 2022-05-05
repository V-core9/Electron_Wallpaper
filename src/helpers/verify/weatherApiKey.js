const verify = require('./_');

module.exports = async (val) => (await verify.isString(val) && (val.length === 32));