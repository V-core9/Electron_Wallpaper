module.exports = async (title, vCache) => {
  let stats = await vCache.stats();
  return `<section>
            <header>
              <h3>${title}:</h3>
              <div>
                <h5>Hits:</h5>
                <p>${stats.hits}</p>
              </div>
              <div>
                <h5>Misses:</h5>
                <p>${stats.misses}</p>
              </div>
              <div>
                <h5>Count:</h5>
                <p>${stats.count}</p>
              </div>
              <div>
                <h5>Size:</h5>
                <p>${stats.size}</p>
              </div>
            </header>
          </section>`;
};
