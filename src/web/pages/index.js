/*
 * Pages
 */
const pages = {
  // Root App Page
  Home: require("./Home"),

  // Settings Page
  Settings: require("./Settings"),

  // App Debug Page
  Debug: require("./Debug"),

  // Prisma Demo Page
  Domains: require("./Domains"),

  // Example User-Config Page
  Account: require("./Account"),

  // Example Page
  Theme: async () => {
    return `Welcome, this is just a placeholder for a WALLPAPER THEME page.`;
  },
};

module.exports = pages;
