const { NavMain } = require("../../Base");

const Navigation = async () => {
  return `${await NavMain()}`;
};

module.exports = Navigation;
