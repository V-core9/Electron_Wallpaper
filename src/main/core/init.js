const { vTime } = require('v_core_timers');
const { watch, cache } = require('.');
const { screenshotDesktop, clock, wallpaper } = require('../actions');
const config = require('../../helpers/config');

module.exports = async () => {

  await watch.new("screenshot-desktop", await vTime.minutes(5), screenshotDesktop);
  await watch.run("screenshot-desktop");

  await watch.new("clock", await vTime.seconds(1), clock);
  await watch.run("clock");

  
  await watch.new("wallpaper_render", await vTime.seconds(5), wallpaper.render, config.backgroundUpdates);

  let wallpaperTask = await watch.get("wallpaper_render");
  wallpaperTask.on('run', wallpaper.set);

  await watch.run("wallpaper_render");

  await cache.set('application_title', config.title);
  await cache.set('application_version', config.version);
  await cache.set('application_description', config.description);

};