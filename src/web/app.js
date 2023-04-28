const { log, info, warn } = require("../helpers/logger");
const { dataCache, renderCache } = require("./core/caches");
const actions = require("./core/actions");
const { Application } = require("./core/renders");

// Run the whole thing
(async () => {
  await dataCache.set("currentPage", "home");

  dataCache.on("purge", async () => {
    log("Cache Purged");
    actions.openPage("home");
  });

  dataCache.on("purge_stats", async (data) => {
    log("purge_stats CB>>", data);
  });

  window.addEventListener("click", async (event) => {
    try {
      const action = event.target.getAttribute("action");
      if (!action) return;
      if (!actions[action]) return log(`⚠ Action not found [ ${action} ]`, event);
      return actions[action](event);
    } catch (error) {
      warn(error, event);
    }
  });

  window.addEventListener("resize", async (event) => {
    log("Resize Event", event);
    await actions.isMaximized();
  });

  window.addEventListener("blur", actions.windowBlur);

  window.addEventListener("focus", actions.windowFocus);

  window.addEventListener("beforeunload", async (event) => {
    warn("Yea BeforeUnload Alert", event);
  });

  window.addEventListener("unload", async (event) => {
    warn("Yea Unload Alert", event);
  });

  window.onload = async () => {
    info("Window Loaded");
    actions.initApp();
  };
})();
