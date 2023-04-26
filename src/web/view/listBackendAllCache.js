const { dataCache } = require("../core/caches");

module.exports = async () => {
  let backCache = (await dataCache.get("listBackendAllCache")) || new Map();

  return `<section>
            <header>
              <h2>Backend Cache Stats:</h2>
              <button action='listBackendAllCache'>list Backend All Cache</button>
              <button action='purgeBackendCache'>purgeBackendCache</button>
            </header>
            <content>
              ${backCache
                .map(
                  (value, key) => `<item>
                  <h3>${key}</h3>
                  <p>${JSON.stringify(value)}</p>
                </item>`
                )
                .join("")}
            </content>
          </section>`;
};
