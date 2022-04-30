const { vTime } = require('v_core_timers');
const { watch, cache } = require('.');
const { screenshotDesktop, clock, wallpaper, systemInfoStats } = require('../actions');
const config = require('../../helpers/config');

module.exports = async () => {

  await watch.new("screenshot-desktop", await vTime.minutes(5), screenshotDesktop);
  await watch.run("screenshot-desktop");

  
  await watch.new("wallpaper_render", await vTime.seconds(1), wallpaper.render, config.backgroundUpdates);

  let wallpaperTask = await watch.get("wallpaper_render");
  wallpaperTask.on('run', wallpaper.set);

  await watch.run("wallpaper_render");


  await watch.new("clock", await vTime.seconds(1), clock);
  await watch.run("clock");


  await watch.new("systemInfoStats", await vTime.seconds(1), systemInfoStats);
  await watch.run("systemInfoStats");


  await cache.set('application_title', config.title);
  await cache.set('application_version', config.version);
  await cache.set('application_description', config.description);

};