const ip = require("ip");
const publicIp = require("public-ip");
const { cache } = require("../core");

module.exports = ipAddress = async (loc = "ipAddress") => {
  const data = {
    local: ip.address(),
    public: {
      v4: await publicIp.v4(),
    },
  };
  await cache.set(loc, data, 120000);
  return data;
};

