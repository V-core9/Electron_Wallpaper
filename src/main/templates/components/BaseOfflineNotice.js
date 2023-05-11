const draw = require('../_draw')

const BaseOfflineNotice = async (props) => {
  const { mainText, altText, width, mainColor, fontSize } = props
  return `<path d="M 170 697.5 l ${width - 340}  0 5 5 0 10 -5 5 ${-(
    width - 340
  )}  0 -5 -5 0 -10 5 -5" stroke="${mainColor}80" stroke-width="1" fill="${mainColor}50" ></path>
            ${await draw.text(180, 710, mainText, '#000000', fontSize)}
            ${await draw.text(640, 710, altText, '#000000', fontSize)}
            `
  //           ${await draw.image(1080, 520, 200, 200, await cache.get("PICKLE_BASE64"))}
}

module.exports = BaseOfflineNotice
