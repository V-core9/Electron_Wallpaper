const path = require("path");

const config = require("../../../../config");

const props_to_attribute = require("../../../utils/props_to_attribute");
const load_style_code = require("../../../utils/load_style_code");

const { Header, Nav, Content, Footer, Style } = require("../../Base");
const { Header_Default, Footer_Default } = require("../../Custom");

const SimplePageLayout = async (props = {}) => {
  if (await config.get("debug")) log(`Component [Footer]: `, props);

  const { label, children, options } = props;
  return `${await Style({
    cssCode: load_style_code(
      path.resolve(__dirname, "./simple_page_layout.css")
    ),
  })}
            <div ${props_to_attribute(options)}>
            

            ${await Header({
              children: async () => `${await Header_Default()}`,
            })}
                        <div class='flex-row' style='flex: 1; max-height: calc(100% - 3.75em);'>
                          ${await Nav()}
                          ${await Content({
                            children: async () => `${!label ? (!children ? `` : await children()) : label}`,
                          })}
                        </div>
                        ${await Footer({
                          children: async () => `${await Footer_Default()}`,
                        })}
          </div>`;
};

module.exports = SimplePageLayout;
