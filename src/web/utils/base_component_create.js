const propsToAttribute = require('./propsToAttribute')
const loadStyleCode = require('./loadStyleCode')
const Style = require('../components/Style/Style')

const base_component_create = ({ htmlElemName, debug, cssPath }) => {
  const component = async (props = {}) => {
    const cssCode = loadStyleCode(cssPath)
    debug && log(`Component [${htmlElemName}]: `, props)

    const { label, children, options } = props
    return `${!cssCode ? `` : await Style({ cssCode })}
              <${htmlElemName} ${propsToAttribute(options)}>
              ${!label ? (!children ? `` : await children()) : label}
            </${htmlElemName}>`
  }

  return component
}

const BCC = base_component_create

module.exports = {
  base_component_create,
  BCC,
}
