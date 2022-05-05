const { vTime } = require('v_core_timers');
const { watch, cache } = require('.');
const { screenshotDesktop, clock, wallpaper, systemInfoStats, vWatchDBG, weatherApi } = require('../tasks');
const config = require('../../config');

module.exports = async () => {

  // DEBUG
  await watch.new("vWatchDBG", await vTime.seconds(15), vWatchDBG);

  // WALLPAPER TASK
  await watch.new("wallpaper_render", await vTime.seconds(1), async () => wallpaper.render(), await config.get('backgroundUpdates'));

  // CLOCK for rendering
  await watch.new("clock", await vTime.seconds(1), async () => clock());

  // CPU / RAM ...etc
  await watch.new("systemInfoStats", await vTime.seconds(1), async () => systemInfoStats());



  // SCREENSHOTS
  await watch.new("screenshot-desktop", await vTime.minutes(5), async () => screenshotDesktop());
  await watch.run("screenshot-desktop");

  // weatherApi
  await watch.new("weatherApi", await vTime.hours(1), async () => weatherApi());
  await watch.run("weatherApi");


  await cache.set('application_title', await config.get('title'));

};