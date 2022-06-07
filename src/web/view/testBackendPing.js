const { dataCache } = require('../core/caches');

module.exports = async () => {
  let backPing = await dataCache.get('testBackendPing') || { fb: 0, bf: 0 };
  return `<section>
            <header>
              <h3>Application Test Actions: [ fb:${backPing.fb}, bf:${backPing.bf} ]</h3>
            </header>
            <form_group>
              <button action='testBackendPing'>Test Backend Ping</button>
            </form_group>
          </section>`;
};