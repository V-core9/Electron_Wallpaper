const { dataCache } = require("../core/caches");
const { domainList } = require("../core/actions");

const DomainsPage = async () => {
  if (!(await dataCache.get("domains/list/initLoad"))) {
    await dataCache.set("domains/list/initLoad", true, 1000);
    await domainList();
  }
  const domains = (await dataCache.get("domain/list")) || [];
  return `<h2>DOMAINS</h2>
    ${domains.map((i) => `<p>${i.title}</p>`).join("")}
    `;
};

DomainsPage.layout = `base_dashboard_layout`;

module.exports = DomainsPage;
