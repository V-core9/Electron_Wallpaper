const path = require('path')
const config = require('../../../config')
const { BCC } = require('../../utils/base_component_create')

const Nav = BCC({
  htmlElemName: 'nav',
  debug: config.getSy('debug'),
  cssPath: path.resolve(__dirname, './nav.css'),
})

module.exports = Nav
