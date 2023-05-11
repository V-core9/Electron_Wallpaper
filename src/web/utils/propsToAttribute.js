const isOk = (value) => !value || value.length === 0

const propsToAttribute = (options = {}) => {
  const action = options.action || null
  const classes = options.classes || null
  const id = options.id || null
  const style = options.style || null

  const action_attr = isOk(action) ? `` : `action='${action}'`

  const classes_attr = isOk(classes) ? `` : `class='${classes?.join(' ')}'`

  const id_attr = isOk(id) ? `` : `id='${id}'`

  const style_attr = isOk(style) ? `` : `style='${style}'`

  return `${action_attr} ${classes_attr} ${style_attr} ${id_attr}`
}

module.exports = propsToAttribute
