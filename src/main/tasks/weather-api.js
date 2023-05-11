var weather = require('openweather-apis')
const { cache } = require('../core')
const config = require('../../config')
const { log } = require('../../helpers/logger')

;(async () => {
  weather.setLang('en')
  weather.setAPPID(await config.get('weatherApiKey'))
})()

module.exports = weatherApi = async () => {
  if ((await config.get('weatherApiKey')) !== null) {
    weather.setCity(await config.get('weatherCity'))
    weather.setUnits(await config.get('weatherUnits'))

    weather.getAllWeather(async (err, JSONObj) => {
      log(JSONObj)
      await cache.set('weatherApi', JSONObj)
    })
  }
}
