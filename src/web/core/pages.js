/*
 * Pages
 */
const pages = {
  home: async () => await require("../page/home")(),

  theme: async () => {
    return `Welcome, this is just a placeholder for a WALLPAPER THEME page.`;
  },

  account: async () => await require("../page/account")(),

  settings: async () => await require("../page/settings")(),

  debug: async () => await require("../page/debug")(),

  domains: async () => await require("../page/domains")(),
};

module.exports = pages;
