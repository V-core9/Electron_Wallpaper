const { app } = require('electron');
const config = require('../../config');
const { watch } = require('../core');
const v_fs = require('v_file_system');
const { log, info } = require('../../helpers/logger');
const { wallpaper } = require('../tasks');

module.exports = async () => {
  info('[x] App EXITING : ');

  log('Setting Cache [exiting] to true');
  await config.set('exiting', true);

  log('Ending all WATCH tasks.');
  await watch.end();

  log('Manually Rendering EXIT Wallpaper');
  await wallpaper.render();
  
  log('Saving Config To File.');
  await v_fs.write(await config.get('configFilePath'), JSON.stringify(await config.all(), null, 2));

  setTimeout(() => {
    info('Bye');
    app.quit();
  }, 1000);
};