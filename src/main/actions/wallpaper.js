var svg2png = require('svg2png');
const wallpaper = require('wallpaper');
const { screen } = require('electron');
const path = require('path');
const v_fs = require('v_file_system');


// SVG Template To Use
const { baseTemplate } = require('../templates');


// File Paths
const svgFilePath = path.join(__dirname, '../temp/wallpaper.svg');
const filePath = path.join(__dirname, '../temp/wallpaper.png');



module.exports = {

  render: async () => {

    console.time('Screen Sizes');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    console.timeEnd('Screen Sizes');

    console.time('PNG Save');
    await v_fs.write(filePath, await svg2png(await baseTemplate.render(), { width: width, height: height }));
    console.timeEnd('PNG Save');

  },

  set: async () => wallpaper.set(filePath),

};