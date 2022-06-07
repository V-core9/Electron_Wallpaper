const listBackendTasks = require('../view/listBackendTasks');

module.exports = async () => {
  return `${await listBackendTasks()}`;
};