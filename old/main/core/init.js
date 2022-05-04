const { vTime } = require('v_core_timers');
const { watch, cache } = require('.');
const { screenshotDesktop, clock, wallpaper, systemInfoStats, vWatchDBG, weatherApi } = require('../tasks');
const config = require('../../helpers/config');

module.exports = async () => {

  // SCREENSHOTS
  await watch.new("screenshot-desktop", await vTime.minutes(5), async () => screenshotDesktop());
  await watch.run("screenshot-desktop");


  // DEBUG
  await watch.new("vWatchDBG", await vTime.seconds(30), vWatchDBG);
  await watch.run("vWatchDBG");


  // WALLPAPER TASK
  await watch.new("wallpaper_render", await vTime.seconds(1), async () => wallpaper.render(), config.backgroundUpdates);
  await watch.run("wallpaper_render");


  // CLOCK for rendering
  await watch.new("clock", await vTime.seconds(1), async () => clock());
  await watch.run("clock");


  // CPU / RAM ...etc
  await watch.new("systemInfoStats", await vTime.seconds(1), async () => systemInfoStats());
  await watch.run("systemInfoStats");


  await watch.new("weatherApi", await vTime.hours(1), async () => weatherApi());
  await watch.run("weatherApi");


  await cache.set('application_title', config.title);
  await cache.set('application_version', config.version);
  await cache.set('application_description', config.description);

};