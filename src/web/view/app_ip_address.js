const { dataCache } = require("../core/caches");
const { ipAddress } = require("../core/actions");

module.exports = async () => {
  if (!(await dataCache.get("device_ip_address/initLoad"))) {
    await dataCache.set("device_ip_address/initLoad", true, 1000);
    await ipAddress();
  }

  const data = (await dataCache.get("device_ip_address")) || "undefined";

  return `<section class='device_ip_address'>
            <header>
              <h3>👨‍💻 Device IP Address</h3>
            </header>
            <content class='flex-column'>
              <item>
                <h3>Local IP:</h3>
                <h3>${data?.local}</h3>
              </item>
              <item>
                <h3>Public(v4):</h3>
                <h3>${data?.public?.v4}</h3>
              </item>
            </content>
          </section>`;
};