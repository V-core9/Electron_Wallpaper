const { dataCache } = require('../../core/caches')
const Button = require('../Button/Button')
const Header = require('../Header/Header')
const Section = require('../Section/Section')

const newTaskFormModal = async () => {
  const availableFunctions = await dataCache.get('listAvailableTasks')

  let response = ''
  availableFunctions.forEach((item) => {
    response += `<option value="${item}">${item}</option>`
  })

  return `<modal class='newTaskForm'>
            <overlay></overlay>
            <inner>
              <header>
                <h2>New Task</h2>
              </header>
              <content>
                <group class='flex-row'>
                  <p>Task ID/Name:</p>
                  <input type='text' id='newTaskName' placeholder='Task_id' />
                </group>

                <group class='flex-row'>
                  <p>Interval:</p>
                  <input type='number' id='newTaskInterval' placeholder='2500' />
                </group>
                  
          
                <group class='flex-row'>
                  <p>Function to run:</p>
                  <select id='newTaskFunction'>
                    ${response}
                  </select>
                </group>

                <group class='flex-row'>
                  <p>Enabled:</p>
                  <input type='checkbox' id='newTaskEnabled' checked />
                </group>

                <group class='flex-row'>
                  <button action='createNewTask'>Create</button>
                  <button action='toggleNewTaskForm'>Cancel</button>
                </group>

              </content>
            </inner>
          </modal>`
}

const listBackendTasks = async () => {
  let data = (await dataCache.get('listBackendTasks')) || {}
  let newTaskModalShown = (await dataCache.get('newTaskModalShown')) || false
  log(data)

  let tasks = data.tasks || []

  const newTaskButton = {
    label: `➕ New Task`,
    options: { action: `toggleNewTaskForm` },
  }

  return `${await Header({
    children: async () => `<h2>Watch Tasks:</h2>
                                    ${await Button(newTaskButton)}`,
    options: {},
  })}
            <content>
              ${tasks
                .map(
                  (task) => `<item taskName='${task.name}'>
                    <header>
                      <h4>🆔 ${task.name}</h4>
                      <h5>${task.active ? '🚀 Running' : '🟥 Disabled'}</h5>
                      <h5>➰ Interval: ${task.interval}ms</h5>
                    </header>
                    <actions>
                      <button action='startSpecificTask' ${
                        task.active ? 'disabled' : ''
                      }>🚀 Start</button>
                      <button action='stopSpecificTask' ${
                        !task.active ? 'disabled' : ''
                      }>🔻 Stop</button>
                      <button action='deleteSpecificTask'>❌ Delete</button>
                    </actions>
                  </item>`
                )
                .join('')}
            </content>
            <footer>
              <group class='flex-row'>
                <h5>Total Tasks: ${data.totalTasksCount}</h5>
                <h5>Active Tasks: ${data.activeTasksCount}</h5>
                <h5>Disabled Tasks: ${data.disabledTasksCount}</h5>
              </group>
              <group class='flex-row'>
              ${await Button({
                label: `Refresh List`,
                options: {
                  action: `listBackendTasks`,
                },
              })}
              ${await Button({
                label: `End All`,
                options: { action: `endAllTasks` },
              })}
              </group>
            </footer>
          ${newTaskModalShown ? await newTaskFormModal() : ''}`
}

const section = {
  children: async () => {
    return `${await listBackendTasks()}`
  },
  options: {
    classes: ['listBackendTasks'],
    style: 'color: orange;',
  },
}

const ListBackendTasks = async () => {
  return `${await Section(section)}`
}

module.exports = ListBackendTasks
