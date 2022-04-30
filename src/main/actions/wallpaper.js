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

    console.time('SVG Render');
    const renderResult = await baseTemplate.render();
    console.timeEnd('SVG Render');

    console.time('SVG Save');
    await v_fs.write(svgFilePath, renderResult);
    console.timeEnd('SVG Save');

    console.time('SVG Read');
    const svgData = await v_fs.read(svgFilePath);
    console.timeEnd('SVG Read');

    console.time('SVG 2 PNG');
    const svgPng = await svg2png(svgData, { width: width, height: height });
    console.timeEnd('SVG 2 PNG');

    console.time('PNG Save');
    await v_fs.write(filePath, svgPng);
    console.timeEnd('PNG Save');

  },

  set: async () => {
    console.time('Setting Wallpaper...');
    await wallpaper.set(filePath);
    console.timeEnd('Setting Wallpaper...');
  },

};