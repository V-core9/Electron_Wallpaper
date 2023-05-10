const logger = require("../../helpers/logger");
const caches = require("../core/caches");
const actions = require("../core/actions");
const renders = require("../core/renders");

const components = require("../components");

const pages = require("../pages");

const { BCC, base_component_create } = require("./base_component_create");
const propsToAttribute = require("./propsToAttribute");
const loadStyleCode = require("./loadStyleCode");
const createNewPage = require("./createNewPage");

const utils = {
  BCC,
  base_component_create,
  propsToAttribute,
  loadStyleCode,
  createNewPage,
};

//?- - - - - - - - - - - - - -
//? Window Object Attachment
const v9 = {
  core: {
    actions,
    caches,
    renders,
  },
  components,
  logger,
  pages,
  utils,
};
//!- - - - - - - - - - - - - -

module.exports = v9;

