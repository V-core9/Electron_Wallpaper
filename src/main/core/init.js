const { watch, cache } = require('.')
const config = require('../../config')

let appTasks = require('./app-tasks')
const callbacks = require('../tasks')

module.exports = async () => {
  let tasks = Object.keys(appTasks)

  for (let task of tasks) {
    let data = appTasks[task]

    watch.new(task, data.interval, callbacks[data.callback], data.enabled)
    if (data.initRun) watch.run(task)
  }

  await cache.set('application_title', await config.get('title'))
}
