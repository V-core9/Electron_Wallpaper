const { cache } = require('../core');
const { byteSizer } = require('v_file_system');
const { v_os, roundNumber } = require('../helpers');
const { vTime } = require('v_core_timers');

const config = require('../../helpers/config');


module.exports = async () => {

  const result = {

    ram: {
      freememproc: v_os.freememproc(),

      freemem: roundNumber(byteSizer.byteToGiga(v_os.freemem()), 2),

      totalmem: roundNumber(byteSizer.byteToGiga(v_os.totalmem())),
    },

    deviceUserInfo: process.env.USERNAME + " [ " + v_os.version() + " | " + v_os.platform() + process.arch + " ]",

    cpu: {
      count: v_os.cpu.count(),
      usage: await v_os.cpu.usage(await vTime.seconds(config.redrawTime)),
    },

  };

  await cache.set("system", result);

};
