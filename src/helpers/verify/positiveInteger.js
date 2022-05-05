const verify = require('./_');

module.exports = async (value) => (await verify.isInteger(value) && value > -1);