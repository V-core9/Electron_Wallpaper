const { renderCache, dataCache } = require("./caches");
const pages = require("../pages");

const Header = require("../view/appHeader");
const Footer = require("../view/appFooter");
const loading_modal_overlay = require("../view/loading_modal_overlay");

// DOM Parser Validation
const supportsDOMParser = (function () {
	if (!window.DOMParser) return false;
	var parser = new DOMParser();
	try {
		parser.parseFromString('x', 'text/html');
	} catch(err) {
		return false;
	}
	return true;
})();

const stringToHTML = (str) => {

	// If DOMParser is supported, use it
	if (supportsDOMParser) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(str, 'text/html');
		return doc.body;
	}

	// Otherwise, fallback to old-school method
	var dom = document.createElement('div');
	dom.innerHTML = str;
	return dom;

};

// Adding to dom function
const toDOM = async (selector, component) => {
  try {
    if (!stringToHTML(component)) return Error('Invalid component HTML');
    const parent = document.querySelector(selector);
    if (!parent) return log('No Parent Element Found, render not added to DOM: ', selector, component, component?.constructor?.name);
    return parent.innerHTML = component;
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

const toCACHE = async (componentName, data, cacheFor) => await renderCache.set(componentName, data, cacheFor)


const createTrackedRender = (
  componentName,
  componentFunction,
  domSelector,
  options = {}
) => {
  const cacheFor = options.cacheFor || 33;
  const component = async (data) => {
    if (data.compName === componentName) {
      if (data.render) {
        log(`%c${componentName} ▶ Cache.`, "color:orange");
        return await toCACHE(componentName, await componentFunction(data), cacheFor);
      }

      log(`%c${componentName} ▶ DOM.`, "color:cyan");
      return await toDOM(domSelector, await renderCache.get(componentName));
    }
  };
  
  dataCache.on('set', async (data) => await component({ ...data, render: true, compName: componentName }));
  renderCache.on('set', async (data) => (data.key === componentName) ? await component({ ...data, render: false, compName: componentName }) : null);
};

//*---------------------------
//* Page Layouts 
const layouts = {
  // Base Page Layout
  base_layout_001: `<header></header>
                      <content></content>
                    <footer></footer>`,
  // Base Dashboard Layout
  base_dashboard_layout: `<header></header>
                            <div class='flex-row' style='flex: 1'>
                              <nav></nav>
                              <content></content>
                            </div>
                          <footer></footer>`,
};

//*-------------------------------
//* RENDER PAGE LAYOUT BY NAME

const checkLayoutExistByName = (name) => {
  return (Object.keys(layouts).indexOf(name) !== -1 );
}
const defaultLayoutName = 'base_layout_001';
const renderPageLayout = async (layoutName = defaultLayoutName) => {
  log('Page Layout Render: ', layoutName);

  if (!checkLayoutExistByName(layoutName)) {
    warn(`Layout ${layoutName} does not exist`);
    return layouts[defaultLayoutName];
  }
  
  return layouts[layoutName];
}
//*-------------------------------

//! Event check to maybe render different page layout
dataCache.on('set', async (data) => {
  if (data.key === 'currentPage' && await dataCache.get('lastPage') !== data.value) {
    log(`EVENT: Page Change`, data);
    const maybeLayoutName = pages[data.value].layout;
    const layoutName = checkLayoutExistByName(maybeLayoutName) ? maybeLayoutName : defaultLayoutName;
    await toDOM('v_app', await renderPageLayout(layoutName)) 
    await dataCache.set('lastPage', data.value); 
    document.querySelector('v_app').className = layoutName;
  }
})

// Create actual components to track.
const cacheFor = 16;
const header = createTrackedRender("header_render", Header, "v_app header", { cacheFor });
const content = createTrackedRender("content_render", Content, "v_app content", { cacheFor });
const footer = createTrackedRender("footer_render", Footer, "v_app footer", { cacheFor });

const  NavMain = require('../view/NavMain');
const navigation = createTrackedRender("navigation_render", NavMain, "v_app nav", { cacheFor });

module.exports = { 
  header, 
  footer, 
  content 
};
