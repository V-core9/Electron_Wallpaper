const weather_api_form = require('../view/weather_api_form')

const Account = async () => {
  return `${await weather_api_form()}`
}

Account.layout = 'UnknownLayoutName'

module.exports = Account
