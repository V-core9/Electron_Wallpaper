const config = require("../../../config");

const change_title_form = async () => {
  return `<section>
            <header>
              <h3>Settings:</h3>
            </header>
            <content>
              <item>
                <group>
                  <label>Title:</label>
                </group>
                <group>
                  <input type='text' id='customTitle' placeholder='Change Title to Something' value='${await config.get(
                    "title"
                  )}' />
                </group>
              </item>
            </content>
            <footer>
              <group class='flex-row'>
                <button action='setAppTitle'>☑ Save</button>
                <button action='resetTitle'>✖ Reset</button>
              </group>
            </footer>
          </section>`;
};

module.exports = change_title_form;