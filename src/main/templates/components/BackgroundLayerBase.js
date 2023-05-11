const BackgroundLayerBase = async (props) => {
  const { width, height, mainColor, backColor, strokeWidth } = props
  return `<path d="M 0 0 l ${width}  0 0 ${height} -${width} 0 -${width} -${height} " stroke="none" stroke-width="${strokeWidth}" fill="#000" ></path>
            <path d="M 30 10 l 120 0 20 20 ${width - 340} 0 20 -20 120 0 20 20 0 120 -20 20 0 ${
    height - 340
  } 20 20 0 120 -20 20 -120 0 -20 -20 -${width - 340} 0 -20 20 -120 0 -20 -20 0 -120 20 -20 0 -${
    height - 340
  } -20 -20 0 -120 20 -20" stroke="${mainColor}50" stroke-width="${strokeWidth}" fill="${backColor}50" ></path>`
}

module.exports = BackgroundLayerBase
