const path = require('path');
const wallpaper = require('wallpaper');

module.exports = {
  render: async () => {
    console.log('rendering...');
  },
  set: async () => {
    console.log('Setting Wallpaper...');
    await wallpaper.set(path.join(__dirname, '../temp/wallpaper.jpg'));
  },
};