const weather_api_form = require('../view/weather_api_form');

module.exports = async () => {
  return `${await weather_api_form()}`;
};