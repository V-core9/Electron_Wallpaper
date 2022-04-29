const path = require('path');
const v_fs = require('v_file_system');
const wallpaper = require('wallpaper');
var svg2png = require('svg2png');
const { screen } = require('electron');

const { baseTemplate } = require('../templates');

const svgFilePath = path.join(__dirname, '../temp/wallpaper.svg');
const filePath = path.join(__dirname, '../temp/wallpaper.png');

module.exports = {
  render: async () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    console.log('rendering...');
    await v_fs.write(svgFilePath, await baseTemplate.render());
    await v_fs.write(filePath, await svg2png(await v_fs.read(svgFilePath), { width: width, height: height }));
  },
  set: async () => {
    console.log('Setting Wallpaper...');
    await wallpaper.set(filePath);
  },
};