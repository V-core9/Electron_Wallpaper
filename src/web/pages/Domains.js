const { dataCache } = require("../core/caches");
const { domainList } = require("../core/actions");

// Utils
const { create_new_page } = require("../utils");
// Layout
const SimplePageLayout = require("../components/Layouts/SimplePageLayout/SimplePageLayout");

// Create Page using PageRender and some config options
const Domains = create_new_page({
  title: "Domains",
  description: "Root Page Example",
  render: async () =>
    `${await SimplePageLayout({
      children: async () => {
        if (!(await dataCache.get("domains/list/initLoad"))) {
          await dataCache.set("domains/list/initLoad", true, 1000);
          await domainList();
        }
        const domains = (await dataCache.get("domain/list")) || [];
        return `<h2>DOMAINS</h2>
        ${domains.map((i) => `<p>${i.title}</p>`).join("")}
        `;
      },
    })}`,
});

module.exports = Domains;
