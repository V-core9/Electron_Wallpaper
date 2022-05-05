const { app } = require('electron');
const config = require('../../config');
const { watch } = require('../core');
const v_fs = require('v_file_system');

module.exports = async () => {
  await config.set('exiting', true);
  await watch.run('wallpaper_render');
  
  await v_fs.write(await config.get('configFilePath'), JSON.stringify(await config.all(), null, 2));

  setTimeout(() => app.quit(), 1000);
};