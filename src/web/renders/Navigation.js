const { NavMain } = require("../components");

const Navigation = async () => {
  return `${await NavMain()}`;
};

module.exports = Navigation;
