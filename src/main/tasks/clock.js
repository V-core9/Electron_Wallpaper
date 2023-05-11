const { cache } = require('../core')

module.exports = clockUpdate = async () => {
  var date = new Date()
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var seconds = date.getSeconds()
  var datePrint = String(date).split(' ')

  datePrint = datePrint[0] + ' ' + datePrint[1] + ' ' + datePrint[2] + ' ' + datePrint[3]

  hours = hours < 10 ? ' ' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  var strTime = hours + ':' + minutes + ':' + seconds

  cache.set('clock', { strTime, datePrint })
}
