// Adding a custom String(str).reverse() method
String.prototype.reverse = function () {
  try {
    return this.split("").reverse().join("");
  } catch (err) {
    return err.message;
  }
};

const debounceRender = (instance) => {
  // If there's a pending render, cancel it
  if (instance.debounce) {
    window.cancelAnimationFrame(instance.debounce);
  }

  // Setup the new render to run at the next animation frame
  instance.debounce = window.requestAnimationFrame(function () {
    instance.render();
  });
};

const handler = (instance) => {
  return {
    get: function (obj, prop) {
      if (
        ["[object Object]", "[object Array]"].indexOf(
          Object.prototype.toString.call(obj[prop])
        ) > -1
      ) {
        return new Proxy(obj[prop], handler(instance));
      }
      return obj[prop];
    },
    set: function (obj, prop, value) {
      obj[prop] = value;
      debounceRender(instance);
      return true;
    },
    deleteProperty: function (obj, prop) {
      delete obj[prop];
      debounceRender(instance);
      return true;
    },
  };
};

class Rue {
  constructor(options) {
    // Variables
    var _this = this;
    _this.elem = document.querySelector(options.selector);
    var _data = new Proxy(options.data, handler(this));
    _this.template = options.template;
    _this.debounce = null;

    // Define setter and getter for data
    Object.defineProperty(this, "data", {
      get: function () {
        return _data;
      },
      set: function (data) {
        _data = new Proxy(data, handler(_this));
        debounce(_this);
        return true;
      },
    });
  }
  /**
   * Render a UI from the template
   */
  render() {
    // Convert the template to HTML
    var templateHTML = stringToHTML(this.template(this.data));

    // Diff the DOM
    diff(templateHTML, this.elem);
  }
}

/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
const stringToHTML = (str) => {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, "text/html");
  return doc.body;
};

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

const app = new Rue({
  selector: "#app",
  data: {
    heading: "My Todos",
    todos: ["Swim", "Climb", "Jump", "Play"],
  },
  template: function (props) {
    return `
              <h1>${props.heading}</h1>
              <ul>
                  ${props.todos
                    .map(function (todo) {
                      return `<li>${todo}</li>`;
                    })
                    .join("")}
              </ul>`;
  },
});

// Render the initial UI
app.render();

// After 3 seconds, update the data and render a new UI
setInterval(() => {
  app.data.todos.length = 0;
}, 5000);

setInterval(() => {
  app.data.todos = [...app.data.todos, "Take a nap... zzzzz"];
}, 50);

setInterval(() => {
  app.data.heading = String(app.data.heading).reverse();
}, 250);
