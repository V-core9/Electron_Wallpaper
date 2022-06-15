const { dataCache } = require('../core/caches');

module.exports = async () => {
  let backCache = await dataCache.get('listBackendAllCache') || new Map();

  let response = '';

  backCache.forEach((value, key) => {
    response += `<item>
                  <h3>${key}</h3>
                  <p>${JSON.stringify(value)}</p>
                </item>`;
  });

  return `<section>
            <header>
              <h2>Backend Cache Stats:</h2>
              <button action='listBackendAllCache'>list Backend All Cache</button>
              <button action='purgeBackendCache'>purgeBackendCache</button>
            </header>
            <content>
              ${response}
            </content>
          </section>`;
};