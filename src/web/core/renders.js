const { renderCache, dataCache } = require("./caches");
const pages = require("../pages");

const HeaderRender = require("../renders/Header");
const FooterRender = require("../renders/Footer");
const NavigationRender = require("../renders/Navigation");

const {
  LoadingOverlay,
  Header,
  Content,
  Footer,
  Nav,
} = require("../components");

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

const removeAllChildNodes = (el) => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

const renderRemoveChildNodes = false;
// Adding to dom function
const toDOM = async (selector, component) => {
  try {
    if (!stringToHTML(component)) return Error("Invalid component HTML");
    const parent = document.querySelector(selector);
    if (!parent)
      return log(
        `%cNo Parent Element Found, render not added to DOM: ${selector}`,
        "color:purple"
      );
    if (String(parent.innerHTML) === String(component))
      return log(`%cParent Element No Need to update`, "color:red");
    if (renderRemoveChildNodes) removeAllChildNodes(parent);
    return (parent.innerHTML = component);
  } catch (error) {
    log(error);
    return error;
  }
};

let queue_toDOM = []; // To DOM query

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
let minFrameTime = 1000 / 24;
let useTimeout = true;
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
    queue_toDOM = queue_toDOM.sort((a, b) => a.$ts - b.$ts);

    for (let i = 0; i < queue_toDOM.length; i++) {
      const item = queue_toDOM[i];
      await toDOM(item.selector, item.component);
    }
    queue_toDOM = [];
    previousTimeStamp = timestamp;
  }

  if (!stopRender) {
    if (useTimeout) {
      setTimeout(async () => await renderDOM(Date.now()), minFrameTime);
    } else {
      window.requestAnimationFrame(async () => await renderDOM(Date.now()));
    }
  }
};

// Render Current Page trigger
const renderCurrentPage = async (key) => await pages[key]();

// Actual Page Content Render
const ContentRender = async () => {
  return `${await renderCurrentPage(
    (await dataCache.get("currentPage")) || "home"
  )}
            ${
              !(await dataCache.get("app_loaded")) ? await LoadingOverlay() : ""
            }`;
};

const toCACHE = async (componentName, data, cacheFor) =>
  await renderCache.set(componentName, data, cacheFor);

const trackedComponents = [];

window.trackedComponents = () => trackedComponents;

const createTrackedRender = (
  componentName,
  componentFunction,
  domSelector,
  options = {}
) => {
  const cacheFor = options.cacheFor || 250;

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
      const cachedCompVal = await renderCache.get(componentName);

      const notSameCalculated = this.lastRender !== cachedCompVal;

      if (notSameCalculated) {
        this.lastRender = cachedCompVal;
        return await queryToDOM(domSelector, cachedCompVal);
      }

      return;
    }
  };

  component.name = componentName;
  component.render = component;
  component.dataCache = async (data) =>  await component({ ...data, render: true, compName: componentName });
  component.renderCache = async (data) => data.key === componentName ? await component({ ...data, render: false, compName: componentName }) : null;

  dataCache.on("set", component.dataCache );
  renderCache.on("set", component.renderCache );

  trackedComponents.push(component);

  return component;
};

//*---------------------------
//* Page Layouts
let defaultLayoutName = null;

const layouts = {};

window.layouts = () => layouts;

const checkLayoutExistByName = (name) =>
  Object.keys(layouts).indexOf(name) !== -1;

const createPageLayout = (layoutName, pageLayout, trackedComponents) => {
  if (checkLayoutExistByName(layoutName)) {
    warn(`Tracked Component Already Exists: ${layoutName}`);
    return false;
  }
  if (!defaultLayoutName) defaultLayoutName = layoutName;
  layouts[layoutName] = { pageLayout, trackedComponents };
  return layouts[layoutName];
};

const base_layout_001 = async () => `${await Header()}
                                    ${await Content()}
                                    ${await Footer()}`;

const base_layout_001_trackedComponents = [
  {
    name: "header_render",
    render: HeaderRender,
    selector: "v_app header",
  },
  {
    name: "content_render",
    render: ContentRender,
    selector: "v_app content",
  },
  {
    name: "footer_render",
    render: FooterRender,
    selector: "v_app footer",
  },
];

createPageLayout(
  "base_layout_001",
  base_layout_001,
  base_layout_001_trackedComponents
);

const base_dashboard_layout = async () => `${await Header()}
                                          <div class='flex-row' style='flex: 1'>
                                            ${await Nav()}
                                            ${await Content()}
                                          </div>
                                          ${await Footer()}`;

const base_dashboard_layout_trackedComponents = [
  {
    name: "header_render",
    render: HeaderRender,
    selector: "v_app header",
  },
  {
    name: "content_render",
    render: ContentRender,
    selector: "v_app content",
  },
  {
    name: "footer_render",
    render: FooterRender,
    selector: "v_app footer",
  },
  {
    name: "navigation_render",
    render: NavigationRender,
    selector: "v_app nav",
  },
];

createPageLayout(
  "base_dashboard_layout",
  base_dashboard_layout,
  base_dashboard_layout_trackedComponents
);

//*-------------------------------
//* RENDER PAGE LAYOUT BY NAME

const renderPageLayout = async (layoutName = defaultLayoutName) => {
  log("Page Layout Render: ", layoutName);
  if (checkLayoutExistByName(layoutName))
    return await layouts[layoutName].pageLayout();

  warn(`Layout ${layoutName} does not exist`);
  return await layouts[defaultLayoutName]();
};
//*-------------------------------

const maybeTrackNewComponent = async (layoutName) => {
  const comps = layouts[layoutName].trackedComponents;
  trackedComponents?.map(i => {
    dataCache.removeListener('set', i.dataCache);
    renderCache.removeListener('set', i.renderCache)
  })

  comps?.map((comp) => {
    if (trackedComponents.find((i) => i.name === comp.name)) return false;
    return createTrackedRender(comp.name, comp.render, comp.selector);
  });
};

//! Event check to maybe render different page layout

const pageChange = async (data) => {
  if (
    data.key === "currentPage" &&
    (await dataCache.get("lastPage")) !== data.value
  ) {
    log(`EVENT: Page Change`, data);
    const maybeLayoutName = pages[data.value].layout || defaultLayoutName;
    const layoutName = checkLayoutExistByName(maybeLayoutName)
      ? maybeLayoutName
      : defaultLayoutName;
    await queryToDOM("v_app", await renderPageLayout(layoutName));
    document.querySelector("v_app").className = layoutName;

    await maybeTrackNewComponent(layoutName);

    await dataCache.set("lastPage", data.value);
  }
}

dataCache.on("set", pageChange);

module.exports = {
  renderDOM,
};
