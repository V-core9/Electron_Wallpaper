const { log } = require('../../helpers/logger')

const { V_Watch } = require('v_core_timers')
const { V_Core_Cache } = require('v_core_cache')

const cache = new V_Core_Cache()
const watch = new V_Watch()

const createLogItem = (name) => async (taskName) =>
  log(
    `[t] ${name} : ${taskName} \\_ _ _ _ _ \n@ ${new Date().toUTCString()} \n`
  )

watch.on('new', createLogItem('New'))
watch.on('run', createLogItem('Run'))
watch.on('stop', createLogItem('Stop'))

module.exports = {
  cache: cache,
  watch: watch,
}
