module.exports = async () => {
  return `<section>
            <header>
              <h3>Cache Actions:</h3>
            </header>
            <content>
              <actions>
                <button action='logUndefinedItem'>Log undefined Item</button>
                <button action='logAllCache'>Log All Cache</button>
                <button action='logStats'>Log Cache Stats</button>
                <button action='purgeCacheStats'>Purge Stats</button>
                <button action='purgeCache'>Purge Cache</button>
              </actions>
            </content>
          </section>`;
};