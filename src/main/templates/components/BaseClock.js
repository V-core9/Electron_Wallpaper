const draw = require('../_draw')

const BaseClock = async (props) => {
  const {
    strTime,
    datePrint,
    posX,
    posY,
    bigFontSize,
    smallFontSize,
    mainColor,
    altColor,
    backColor,
  } = props
  return `<path d="M ${posX}  ${posY}  l  20 -20 110 0 20 20 -10 0 -15 -15 -100 0 -15 15 -10 0" stroke="#444" stroke-width="2" fill="${backColor}" ></path>
            ${await draw.text(
              posX + 25,
              posY + 2.5,
              strTime,
              mainColor,
              bigFontSize
            )}
            ${await draw.text(
              posX + 22.5,
              posY + 15,
              datePrint,
              altColor,
              smallFontSize
            )}
            <path d="M ${posX}  ${
    posY + 5
  }  l  20 20 110 0 20 -20 -10 0 -15 15 -100 0 -15 -15 -10 0" stroke="#444" stroke-width="2"  fill="${backColor}" ></path>`
}

module.exports = BaseClock
