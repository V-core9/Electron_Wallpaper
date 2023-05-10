const config = require("../../../config");

module.exports = async () => {
  let debug = await config.get("debug");

  return `<section class='app_debug_toggle'>
            <header>
              <h3>👨‍💻 Developer Settings</h3>
            </header>
            <content class='flex-row'>
              <item>
                <h3>Debug Mode: ${debug ? "✅ Enabled" : "🟥 Disabled"}</h3>
                <button action='toggleDebug'>${
                  debug ? "❌ Disable" : "🚀 Enable"
                }</button>
              </item>
            </content>
          </section>`;
};
