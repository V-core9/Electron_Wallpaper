const draw = require('../_draw')

const BaseTopOsInfo = async (props) => {
  const { cpu, ram, mainColor, width, fontSize } = props
  return `<path d="M 170 2.5 l ${width - 340}  0 5 5 0 10 -5 5 ${-(
    width - 340
  )}  0 -5 -5 0 -10 5 -5" stroke="${mainColor}80" stroke-width="1" fill="${mainColor}50" ></path>
              ${await draw.text(
                180,
                15,
                `CPU: ${cpu.usage}% [Count: ${cpu.count}]`,
                mainColor,
                fontSize
              )}
              ${await draw.text(
                640,
                15,
                `RAM: ${ram.freemem}GB (${ram.freememproc}%) [Total: ${ram.totalmem}GB]`,
                mainColor,
                fontSize
              )}`
}

module.exports = BaseTopOsInfo
