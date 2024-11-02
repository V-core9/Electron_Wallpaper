module.exports = async () => {
  return `<section>
            <header>
              <h3>Cache Actions:</h3>
            </header>
            <content>
              <actions>
                <button action='gui/cache/demo/log/undefined'>Log undefined Item</button>
                <button action='gui/cache/all/log'>Log All Cache</button>
                <button action='gui/cache/stats/log'>Log Cache Stats</button>
                <button action='gui/cache/stats/purge'>Purge Stats</button>
                <button action='gui/cache/purge'>Purge Cache</button>
              </actions>
            </content>
          </section>`
}
