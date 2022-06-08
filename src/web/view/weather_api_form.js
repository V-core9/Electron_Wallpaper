const config = require('../../config');

module.exports = async () => {
  return `<section>
            <header>
              <h3>OpenWeather API Key:</h3>
            </header>
            <content>
              <form_group>
                <input type='text' id='weatherApiKey' placeholder='1a2s3d1f65f89wq98ed1sa5dda68d4aa' value='${await config.get('weatherApiKey')}' />
                <button action='setWeatherApiKey'>Save</button>
              </form_group>
            </content>
          </section>`;
};
