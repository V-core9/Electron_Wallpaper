const { dataCache } = require('../core/caches');

module.exports = async () => {
  let backCache = await dataCache.get('listBackendAllCache') || {};

  let response = '';

  for (let key in backCache) {

    response += `<item>${key}: ${JSON.stringify(backCache[key])}</item>`;
  }

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