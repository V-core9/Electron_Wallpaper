const { renderCache, dataCache } = require('./caches');

const appHeader = require('../view/appHeader');
const appFooter = require('../view/appFooter');


async function toDOM(selector, html) {
  try {
    document.querySelector(selector).innerHTML = html;
  } catch (error) {
    log(error);
  }
}


/*
 * Pages
 */
const pages = {

  home: async () => `${await require('../page/home')()}`,

  device: async () => {
    return `Welcome, this is just a placeholder for a DEVICE Info Page.`;
  },

  account: async () => {
    return `Welcome, this is just a placeholder for a ACCOUNT Info Page.`;
  },

  settings: async () => `${await require('../page/settings')()}`,

  debug: async () => `${await require('../page/debug')()}`,

};


const renderCurrentPage = async (key) => await pages[key]();


const appContent = async () => {
  return `${await renderCurrentPage(await dataCache.get('currentPage') || 'home')}`;
};


const renderApp = async () => {
  return `<header>
            ${await header({})}
          </header>

          <content>
            ${await content({})}
          </content>

          <footer>            
            ${await footer({})}
          </footer>`;
};


const header = async (data) => {
  if (data.key === 'header_render') {
    toDOM('v_app header', await renderCache.get("header_render"));
    log("HEADER DOM Updated.");
  }
  
  if (data.render === true) {
    await renderCache.set("header_render", await appHeader(), 16);
    log("HEADER Rendered into Cache.");
  }
};


const content = async (data) => {
  if (data.key === 'content_render') {
    toDOM('v_app content', await renderCache.get("content_render"));
    log("CONTENT DOM Updated.");
  } 

  if (data.render === true) {
    await renderCache.set("content_render", await appContent(), 16);
    log("CONTENT Rendered into Cache.");
  }
};


const footer = async (data) => {
  if (data.key === 'footer_render') {
    toDOM('v_app footer', await renderCache.get("footer_render"));
    log("FOOTER DOM Updated.");
  }
  
  if (data.render === true) {
    await renderCache.set("footer_render", await appFooter(), 16);
    log("FOOTER Rendered into Cache.");
  }
};


const app = async (data) => {
  let startTime = Date.now();
  let happened = 'App Render Cache Update';
  if (data.key === 'appRender') {
    happened = 'App DOM Update';
    document.querySelector('v_app').innerHTML = await renderCache.get("appRender");
  } else {
    await renderCache.set("appRender", await renderApp(), 16);
  }
  let endTime = Date.now() - startTime;
  log(`${happened} in ${endTime}ms`);
};


module.exports = { app, header, footer, content };