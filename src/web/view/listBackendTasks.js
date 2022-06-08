const { dataCache } = require('../core/caches');

const newTaskFormModal = async () => {
  const availableFunctions = await dataCache.get('listAvailableTasks');

  let response = '';
  availableFunctions.forEach(item => {
    response += `<option value="${item}">${item}</option>`;
  });

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
                  <input type='checkbox' id='newTaskActive' checked />
                </group>

                <group class='flex-row'>
                  <button action='createNewTask'>Create</button>
                  <button action='toggleNewTaskForm'>Cancel</button>
                </group>

              </content>
            </inner>
          </modal>`;
};

module.exports = async () => {
  let data = await dataCache.get('listBackendTasks') || {};
  let newTaskModalShown = await dataCache.get('newTaskModalShown') || false;
  log(data);

  let response = '';

  let tasks = data.tasks || [];

  tasks.forEach((task) => {
    response += `<item taskName='${task.name}'>
                    <header>
                      <h4>🆔 ${task.name}</h4>
                      <h5>${(task.active ? '🚀 Running' : '🟥 Disabled')}</h5>
                      <h5>➰ Interval: ${task.interval}ms</h5>
                    </header>
                    <actions>
                      <button action='startSpecificTask' ${(task.active ? 'disabled' : '')}>🚀 Start</button>
                      <button action='stopSpecificTask' ${(!task.active ? 'disabled' : '')}>🔻 Stop</button>
                      <button action='deleteSpecificTask'>❌ Delete</button>
                    </actions>
                  </item>`;
  });

  return `<section class='listBackendTasks'>
            <header>
              <h2>Watch Tasks:</h2>
              <button action='toggleNewTaskForm'>➕ New Task</button>
            </header>
            <content>
              ${response}
            </content>
            <footer>
              <group class='flex-row'>
                <h5>Total Tasks: ${data.totalTasksCount}</h5>
                <h5>Active Tasks: ${data.activeTasksCount}</h5>
                <h5>Disabled Tasks: ${data.disabledTasksCount}</h5>
              </group>
              <group class='flex-row'>
                <button action='listBackendTasks'>Refresh List</button>
                <button action='endAllTasks'>End All</button>
              </group>
            </footer>
          </section>
          ${newTaskModalShown ? await newTaskFormModal() : ''}`;
};