const config = require('../../../config')

const Section = async (props = {}) => {
  if (await config.get('debug')) log(`Component [Section]: `, props)

  const { children, options } = props
  return `<section class='${options?.classes?.join(' ')}' style='${options?.style}'>
            ${await children()}
          </section>`
}

module.exports = Section
