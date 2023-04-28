const weather_api_form = require("../view/weather_api_form");

const AccountPage = async () => {
  return `${await weather_api_form()}`;
};

AccountPage.layout = "UnknownLayoutName";

module.exports = AccountPage;
