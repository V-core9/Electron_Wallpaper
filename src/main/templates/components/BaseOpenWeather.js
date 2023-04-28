const { cache } = require('../../core');
const draw = require('../_draw');

const BaseOpenWeather = async (props) => {
  if (await cache.has('BaseOpenWeather')) return await cache.get('BaseOpenWeather');

  const { whiteColor, mainColor, fontSize, bigFontSize } = props;

  let weatherApi = await cache.get('weatherApi') || { main: {}, wind: {}, clouds: {}, weather: [{ main: "", description: "" }] };
  const { main, description } = weatherApi.weather[0];
  const { temp } = weatherApi.main;
  const { speed } = weatherApi.wind;

  const item = `
              <path d="M 35 15 l 110 0  20 20   -130 130  -20 -20  0 -110  20 -20" stroke="${mainColor}" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(35, 40, "💻 Weather", whiteColor, bigFontSize)}

              <path d="M 35 705 l 110 0   20 -20   -130 -130  -20 20   0 110   20 20" stroke="${mainColor}" stroke-width="1" fill="#101520" ></path>
              ${await draw.text(35, 650, "😎 " + main, whiteColor, fontSize)}
              ${await draw.text(35, 665, "🔥 " + temp + "°C ", whiteColor, fontSize)}
              ${await draw.text(35, 680, description, whiteColor, fontSize)}
              ${await draw.text(35, 695, "〰 " + speed + "m/s", whiteColor, fontSize)}

        `;

  await cache.set('BaseOpenWeather', item, 10000);

  return item;
};

module.exports = BaseOpenWeather;