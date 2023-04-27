const { renderCache, dataCache } = require("./caches");
const pages = require("./pages");

const Header = require("../view/appHeader");
const Footer = require("../view/appFooter");
const loading_modal_overlay = require("../view/loading_modal_overlay");

const toDOM = async (selector, html) => {
  try {
    document.querySelector(selector).innerHTML = html;
    return true;
  } catch (error) {
    log(error);
    return error;
  }
}

const renderCurrentPage = async (key) => await pages[key]();

const Content = async () => {
  return `${await renderCurrentPage((await dataCache.get("currentPage")) || "home")}
          ${(await dataCache.get("app_loaded")) !== true ? await loading_modal_overlay() : ""}`;
};


const createTrackedRender = (
  componentName,
  componentFunction,
  domSelector,
  options = {}
) => {
  const cacheFor = options.cacheFor || 33;
  const component = async (data) => {

    if (data.render === true) {
      await renderCache.set(componentName, await componentFunction(data), cacheFor);
      log(`%c${componentName} ▶ Cache.`, "color:orange");
      return;
    }

    if (data.key === componentName && !data.render) {
      await toDOM(domSelector, await renderCache.get(componentName));
      log(`%c${componentName} ▶ DOM.`, "color:cyan");
      return;
    }
  };
  
  dataCache.on('set', async (data) => await component({ ...data, render: true }));
  renderCache.on('set', component);
};

const header = createTrackedRender("header_render", Header, "v_app header", { cacheFor: 16 });
const content = createTrackedRender("content_render", Content, "v_app content", { cacheFor: 16 });
const footer = createTrackedRender("footer_render", Footer, "v_app footer", { cacheFor: 16 });

module.exports = { 
  header, 
  footer, 
  content 
};
