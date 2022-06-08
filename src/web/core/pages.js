

/*
 * Pages
 */
const pages = {

  home: async () => `${await require('../page/home')()}`,

  device: async () => {
    return `Welcome, this is just a placeholder for a DEVICE Info Page.`;
  },

  account: async () => `${await require('../page/account')()}`,

  settings: async () => `${await require('../page/settings')()}`,

  debug: async () => `${await require('../page/debug')()}`,

};

module.exports = pages;