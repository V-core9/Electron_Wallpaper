/*
 * Pages
 */
const pages = {
  // Root App Page
  Home_Page: require("./Home_Page"),

  // Settings Page
  Settings_Page: require("./Settings_Page"),

  // App Debug Page
  Debug_Page: require("./Debug_Page"),

  // Prisma Demo Page
  Domains_Page: require("./Domains_Page"),

  // Example User-Config Page
  Account_Page: require("./Account_Page"),

  // Example Page
  Theme_Page: async () => {
    return `Welcome, this is just a placeholder for a WALLPAPER THEME page.`;
  },
};

module.exports = pages;
