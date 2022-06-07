const config = require('../../config');

module.exports = async () => {
  return `<section>
            <header>
              <h3>Change Application Title:</h3>
            </header>
            <content>
              <form_group>
                <input type='text' id='customTitle' placeholder='Change Title to Something' value='${await config.get('title')}' />
                <button action='changeAppTitle'>Change</button>
              </form_group>
            </content>
          </section>`;
};
