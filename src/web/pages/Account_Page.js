const weather_api_form = require("../view/weather_api_form");

const Account_Page = async () => {
  return `${await weather_api_form()}`;
};

Account_Page.layout = "UnknownLayoutName";

module.exports = Account_Page;
