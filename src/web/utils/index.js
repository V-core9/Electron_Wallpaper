const require_dir_into_object = require('./require_dir_into_object');

const { BCC, base_component_create } = require("./base_component_create");
const props_to_attribute = require("./props_to_attribute");
const load_style_code = require("./load_style_code");

const create_new_page = require("./create_new_page");

module.exports = {
  BCC,
  base_component_create,
  create_new_page,
  load_style_code,
  props_to_attribute,
  require_dir_into_object,
};
