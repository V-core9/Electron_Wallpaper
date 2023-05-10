const { weather_api_form } = require("../components");

const Account = async () => {
  return `${await weather_api_form()}`;
};

Account.description = "Account description";

module.exports = Account;
