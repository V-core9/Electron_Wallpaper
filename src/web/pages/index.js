/*
 * Pages
 */
const pages = {
  // Root App Page
  home: require("./home"),

  // Settings Page
  settings: require("./settings"),

  // App Debug Page
  debug: require("./debug"),

  // Prisma Demo Page
  domains: require("./domains"),

  // Example User-Config Page
  account: require("./account"),

  // Example Page
  theme: async () => {
    return `Welcome, this is just a placeholder for a WALLPAPER THEME page.`;
  },
};

module.exports = pages;
