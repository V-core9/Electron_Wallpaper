const config = require('../../config');
const v_fs = require('v_file_system');

let appTasks = JSON.parse(v_fs.readSy(config.getSy('tasksListFilePath'))) || {};

module.exports = appTasks;