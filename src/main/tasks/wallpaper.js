
const wallpaper = require('wallpaper');
const path = require('path');
const sharp = require('sharp');


// SVG Template To Use
const { baseTemplate } = require('../templates');

// File Paths
const filePath = path.join(__dirname, '../../temp/wallpaper.png');



module.exports = {

  render: async () => {
    const { screen } = require('electron');

    // Create a window that fills the screen's available work area.
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    sharp(Buffer.from(await baseTemplate.render()))
      .resize(width, height)
      .png()
      .toFile(filePath)
      .then(
        async () => wallpaper.set(filePath)
      );
  },

};