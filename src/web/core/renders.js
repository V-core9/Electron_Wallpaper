const { renderCache, dataCache } = require("./caches");
const pages = require("../pages");

const { LoadingOverlay } = require("../components/Base");

/**
 * Get the type for a node
 * @param  {Node}   node The node
 * @return {String}      The type
 */
const getNodeType = (node) => {
  if (node.nodeType === 3) return "text";
  if (node.nodeType === 8) return "comment";
  return node.tagName.toLowerCase();
};

/**
 * Get the content from a node
 * @param  {Node}   node The node
 * @return {String}      The type
 */
const getNodeContent = (node) => {
  if (node.childNodes && node.childNodes.length > 0) return null;
  return node.textContent;
};

/**
 * Compare the template to the UI and make updates
 * @param  {Node} template The template HTML
 * @param  {Node} elem     The UI HTML
 */
const diff = (template, elem) => {
  // Get arrays of child nodes
  var domNodes = Array.prototype.slice.call(elem.childNodes);
  var templateNodes = Array.prototype.slice.call(template.childNodes);

  // If extra elements in DOM, remove them
  var count = domNodes.length - templateNodes.length;
  if (count > 0) {
    for (; count > 0; count--) {
      domNodes[domNodes.length - count].parentNode.removeChild(
        domNodes[domNodes.length - count]
      );
    }
  }

  // Diff each item in the templateNodes
  templateNodes.forEach(function (node, index) {
    // If element doesn't exist, create it
    if (!domNodes[index]) {
      elem.appendChild(node.cloneNode(true));
      return;
    }

    // If element is not the same type, replace it with new element
    if (getNodeType(node) !== getNodeType(domNodes[index])) {
      domNodes[index].parentNode.replaceChild(
        node.cloneNode(true),
        domNodes[index]
      );
      return;
    }

    // If content is different, update it
    var templateContent = getNodeContent(node);
    if (
      templateContent &&
      templateContent !== getNodeContent(domNodes[index])
    ) {
      domNodes[index].textContent = templateContent;
    }

    // If target element should be empty, wipe it
    if (domNodes[index].childNodes.length > 0 && node.childNodes.length < 1) {
      domNodes[index].innerHTML = "";
      return;
    }

    // If element is empty and shouldn't be, build it up
    // This uses a document fragment to minimize reflows
    if (domNodes[index].childNodes.length < 1 && node.childNodes.length > 0) {
      var fragment = document.createDocumentFragment();
      diff(node, fragment);
      domNodes[index].appendChild(fragment);
      return;
    }

    // If there are existing child elements that need to be modified, diff them
    if (node.childNodes.length > 0) {
      diff(node, domNodes[index]);
    }
  });
};
// DOM Parser Validation
const supportsDOMParser = (function () {
  if (!window.DOMParser) return false;
  const parser = new DOMParser();
  try {
    parser.parseFromString("x", "text/html");
  } catch (err) {
    return false;
  }
  return true;
})();

const domParserParse = (str) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  return doc.body;
};

const domOldParse = (str) => {
  const dom = document.createElement("div");
  dom.innerHTML = str;
  return dom;
};

const stringToHTML = supportsDOMParser ? domParserParse : domOldParse;

// RENDER DOM
let previousTimeStamp = 0;
let stopRender = false;
let minFrameTime = 1000 / 24;
let useTimeout = true;
const renderDOM = async (timestamp) => {
  const elapsed = timestamp - previousTimeStamp;

  if (previousTimeStamp !== timestamp && elapsed >= minFrameTime) {
    // Convert the template to HTML
    var templateHTML = stringToHTML(await ContentRender());

    // Diff the DOM
    diff(templateHTML, document.querySelector("v_app"));
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
const ContentRender = async () =>
  await renderCache.set(
    "app_render",
    `${await renderCurrentPage((await dataCache.get("currentPage")) || "home")}
            ${
              !(await dataCache.get("app_loaded")) ? await LoadingOverlay() : ""
            }`
  );

let lastRender = 0;
(async () => {
  await dataCache.on("set", async (data) => await ContentRender(data));
  await renderCache.on("set/app_render", async () => {
    if (Date.now() - lastRender > minFrameTime) {
      // Convert the template to HTML
      var templateHTML = stringToHTML(await renderCache.get("app_render"));

      // Diff the DOM
      diff(templateHTML, document.querySelector("v_app"));
    }
  });
})();

module.exports = {
  renderDOM,
};
