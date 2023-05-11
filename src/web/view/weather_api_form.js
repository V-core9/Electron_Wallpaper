const config = require('../../config')

module.exports = async () => {
  const weatherUnits = await config.get('weatherUnits')

  return `<section>
            <header>
              <h3>☔ OpenWeather Settings:</h3>
            </header>
            <content>
              <item>
                <group>
                  <p>API Key:</p>
                </group>
                <group>
                  <input type='text' id='weatherApiKey' placeholder='1a2s3d1f65f89wq98ed1sa5dda68d4aa' value='${await config.get(
                    'weatherApiKey'
                  )}' />
                </group>
              </item>
              <item>
                <group>
                  <p>City:</p>
                </group>
                <group>
                  <input type='text' id='weatherCity' placeholder='Sombor' value='${await config.get('weatherCity')}' />
                </group>
              </item>
              <item>
                <group>
                  <p>Units:</p>
                </group>
                <group>
                  <select id='weatherUnits'>
                    <option value='metric' ${weatherUnits == 'metric' ? 'selected' : ''}>Metric</option>
                    <option value='imperial' ${weatherUnits == 'imperial' ? 'selected' : ''}>Imperial</option>
                  </select>
                </group>
              </item>
            </content>
            <footer>
              <group class='flex-row'>
                <button action='setOpenWeatherSettings'>☑ Save</button>
                <button action='resetOpenWeatherSettings'>✖ Reset</button>
              </group>
            </footer>
          </section>`
}
