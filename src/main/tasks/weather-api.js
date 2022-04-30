var weather = require('openweather-apis');
const { cache } = require('../core');
const config = require('../../helpers/config');

weather.setLang('en');

weather.setAPPID(config.weatherApiKey);

module.exports = weatherApi = async () => {

  weather.setCity(config.weatherCity);

  weather.setUnits(config.weatherUnits);

  weather.getAllWeather(async (err, JSONObj) => {
    if (config.debug) console.log(JSONObj);
    await cache.set('weatherApi', JSONObj);
  });

};
