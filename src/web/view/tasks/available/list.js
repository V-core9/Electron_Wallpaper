const { dataCache } = require('../../../core/caches')

module.exports = async () => {
  let tasksList = (await dataCache.get('tasks/available/list')) || {}

  let response = ''

  for (let key in tasksList) {
    response += `<item>${key}: ${JSON.stringify(tasksList[key])}</item>`
  }

  return `<section>
            <header>
              <h2>Available Tasks List</h2>
              <button action='tasks/available/list'>Refresh List</button>
            </header>
            <content>
              ${response}
            </content>
          </section>`
}
