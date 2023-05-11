const draw = {
  rect: async (x, y, width, height, color) =>
    `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" />`,
  circle: async (x, y, radius, color) =>
    `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" />`,
  text: async (x, y, text, color, size) =>
    `<text x="${x}" y="${y}" fill="${
      color || this.main
    }"  text-rendering="geometricPrecision" font-size="${
      size || this.normalFontSize
    }">${text}</text>`,
  line: async (x1, y1, x2, y2, color) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" />`,
  polygon: async (points, color) =>
    `<polygon points="${points}" fill="${color}" />`,
  path: async (d, color) => `<path d="${d}" fill="${color}" />`,
  image: async (x, y, width, height, data) =>
    `<image x="${x}" y="${y}" width="${width}" height="${height}" href="${data}" alt="Description of the image" />`,
}

module.exports = draw
