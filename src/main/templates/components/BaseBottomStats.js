const draw = require('../_draw')

const BaseBottomStats = async (props) => {
  let { netSpeed, system, width, mainColor, fontSize } = props
  return `<path d="M 170 697.5 l ${width - 340}  0 5 5 0 10 -5 5 ${-(
    width - 340
  )}  0 -5 -5 0 -10 5 -5" stroke="${mainColor}80" stroke-width="1" fill="${mainColor}50" ></path>
            ${await draw.text(
              180,
              710,
              `👤 ${system.deviceUserInfo}`,
              mainColor,
              fontSize
            )}
            ${await draw.text(
              640,
              710,
              `🌐 ${netSpeed.external_ip} [ D: ${netSpeed.download} Mbs / U:${netSpeed.upload} Mbs @ ${netSpeed.latency}ms]`,
              mainColor,
              fontSize
            )}`
}

module.exports = BaseBottomStats
