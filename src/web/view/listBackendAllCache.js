const { dataCache } = require('../core/caches')
const { Button } = require('../components')

module.exports = async () => {
  let backCache = (await dataCache.get('listBackendAllCache')) || new Map()

  return `<section>
            <header>
              <h2>Backend Cache Stats:</h2>
              ${await Button({
                label: `📃 List Backend Cache`,
                options: { action: `listBackendAllCache` },
              })}
              ${await Button({
                label: `🔥 Purge Backend Cache`,
                options: { action: `purgeBackendCache` },
              })}
            </header>
            <content>
              ${backCache
                .map(
                  (value, key) => `<item>
                  <h3>${key}</h3>
                  <p>${JSON.stringify(value)}</p>
                </item>`
                )
                .join('')}
            </content>
          </section>`
}
