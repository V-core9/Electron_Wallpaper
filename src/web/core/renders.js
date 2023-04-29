const { renderCache, dataCache } = require("./caches");
const pages = require("../pages");

const Header = require("../renders/Header");
const Footer = require("../renders/Footer");
const Navigation = require("../renders/Navigation");

const { LoadingOverlay } = require("../components");

// DOM Parser Validation
const supportsDOMParser = (function () {
  if (!window.DOMParser) return false;
  var parser = new DOMParser();
  try {
    parser.parseFromString("x", "text/html");
  } catch (err) {
    return false;
  }
  return true;
})();

const stringToHTML = (str) => {
  // If DOMParser is supported, use it
  if (supportsDOMParser) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/html");
    return doc.body;
  }

  // Otherwise, fallback to old-school method
  var dom = document.createElement("div");
  dom.innerHTML = str;
  return dom;
};

// Adding to dom function
const toDOM = async (selector, component) => {
  try {
    if (!stringToHTML(component)) return Error("Invalid component HTML");
    const parent = document.querySelector(selector);
    if (!parent)
      return log(`%cNo Parent Element Found, render not added to DOM: ${selector}`, "color:purple");
    return (parent.innerHTML = component);
  } catch (error) {
    log(error);
    return error;
  }
};

let queue_toDOM = []; // To DOM query

// queryToDOM
// $ -> DOM query selector
// __ -> html to query
const queryToDOM = async (selector, component) => {
  try {
    const qtdItem = { selector, component, $ts: Date.now() };
    if (!stringToHTML(component))
      return Error("Failed to query DOM change: Invalid component HTML");

    let i = 0;
    let found = false;
    while (!found && i < queue_toDOM.length) {
      if (queue_toDOM[i].selector === selector) {
        queue_toDOM[i] = qtdItem;
        found = true;
      }
      i++;
    }

    return !found ? queue_toDOM.push(qtdItem) : true;
  } catch (error) {
    log(error);
    return error;
  }
};

// RENDER DOM
let previousTimeStamp = 0;
let stopRender = false;
let minFrameTime = 60;
const renderDOM = async (timestamp) => {
  const elapsed = timestamp - previousTimeStamp;

  if (
    previousTimeStamp !== timestamp &&
    elapsed >= minFrameTime &&
    queue_toDOM.length > 0
  ) {
    log(
      `%cRAF >> queue_toDOM: [ ${queue_toDOM
        ?.map((i) => i.selector)
        .join(", ")} ]`,
      "color:cyan"
    );
    // queue_toDOM = queue_toDOM.sort((a, b) => a.$ts - b.$ts);

    for (let i = 0; i < queue_toDOM.length; i++) {
      const item = queue_toDOM[i];
      await toDOM(item.selector, item.component);
    }
    queue_toDOM = [];
    previousTimeStamp = timestamp;
  }

  if (!stopRender) {
    window.requestAnimationFrame(() => renderDOM(Date.now()));
  }
};

// Render Current Page trigger
const renderCurrentPage = async (key) => await pages[key]();

// Actual Page Content Render
const Content = async () => {
  return `${await renderCurrentPage(
    (await dataCache.get("currentPage")) || "home"
  )}
          ${
            (await dataCache.get("app_loaded")) !== true
              ? await LoadingOverlay()
              : ""
          }`;
};

//*----------------------------------------------------------------
//* UTILITY: Create Function/Component with custom name
function nameFunction(name, body) {
  return {
    [name](...args) {
      return body.apply(this, args);
    },
  }[name];
}
//* Example:
//? const x = nameFunction("wonderful function", (p) => p*2)
//*----------------------------------------------------------------

const toCACHE = async (componentName, data, cacheFor) =>
  await renderCache.set(componentName, data, cacheFor);

window = {};

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
        log(`%c${componentName} ▶ Cache.`, "color:cyan");
        return await toCACHE(
          componentName,
          await componentFunction(data),
          cacheFor
        );
      }

      log(`%c${componentName} ▶ queryToDOM.`, "color:orange");
      return await queryToDOM(
        domSelector,
        await renderCache.get(componentName)
      );
    }
  };

  dataCache.on(
    "set",
    async (data) =>
      await component({ ...data, render: true, compName: componentName })
  );
  renderCache.on("set", async (data) =>
    data.key === componentName
      ? await component({ ...data, render: false, compName: componentName })
      : null
  );

  return component;
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
  return Object.keys(layouts).indexOf(name) !== -1;
};
const defaultLayoutName = "base_layout_001";
const renderPageLayout = async (layoutName = defaultLayoutName) => {
  log("Page Layout Render: ", layoutName);

  if (!checkLayoutExistByName(layoutName)) {
    warn(`Layout ${layoutName} does not exist`);
    return layouts[defaultLayoutName];
  }

  return layouts[layoutName];
};
//*-------------------------------

//! Event check to maybe render different page layout
dataCache.on("set", async (data) => {
  if (
    data.key === "currentPage" &&
    (await dataCache.get("lastPage")) !== data.value
  ) {
    log(`EVENT: Page Change`, data);
    const maybeLayoutName = pages[data.value].layout;
    const layoutName = checkLayoutExistByName(maybeLayoutName)
      ? maybeLayoutName
      : defaultLayoutName;
    await queryToDOM("v_app", await renderPageLayout(layoutName));
    await dataCache.set("lastPage", data.value);
    document.querySelector("v_app").className = layoutName;
  }
});

// Create actual components to track.
const header = createTrackedRender("header_render", Header, "v_app header");
const content = createTrackedRender("content_render", Content, "v_app content");
const footer = createTrackedRender("footer_render", Footer, "v_app footer");
const navigation = createTrackedRender(
  "navigation_render",
  Navigation,
  "v_app nav"
);

module.exports = {
  header,
  footer,
  content,
  navigation,
  renderDOM,
};
