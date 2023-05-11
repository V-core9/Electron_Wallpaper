const { dataCache } = require('../core/caches')
const { checkLocalPorts } = require('../core/actions')

module.exports = async () => {
  if (!(await dataCache.get('checkLocalPorts/initLoad'))) {
    await dataCache.set('checkLocalPorts/initLoad', true)
    await checkLocalPorts()
  }

  const data = (await dataCache.get('checkLocalPorts')) || {
    host: null,
    ports: { open: [], close: [] },
  }

  return `<section class='check_local_ports'>
            <header>
              <h3>👨‍💻 Device IP Address</h3>
            </header>
            <content class='flex-column'>
              <item >
                <h3>Host:</h3>
                <h3>${data?.host}</h3>
              </item>
              <item >
                <h3>Open Ports:</h3>
                <div class="flex-row" >
                  ${data?.ports?.open
                    ?.map(
                      (port) =>
                        `<div style="border: 1px solid orange; padding: .25em .5em; color: orange;" >${port}</div>`
                    )
                    .join('')}
                </div>
              </item>
            </content>
          </section>
          <style>
          .check_local_ports>content>item>* {
            max-width: 65%;
          }
          
          .check_local_ports>content>item>.flex-row {
              flex-wrap: wrap;
              display: inline-flex;
              gap: .5em;
              justify-content: end;
          }
          </style>`
}
