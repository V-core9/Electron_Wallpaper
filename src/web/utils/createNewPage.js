const createNewPage = (component) => {
  const page = component.render
  Object.keys(component).map((key) => (page[key] = component[key]))
  return page
}

module.exports = createNewPage
