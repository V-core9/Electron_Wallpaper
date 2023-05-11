//? v_os - Empty object to start with.
const v_os = {}

/*
 * Attaching keys from different modules to v_os
 */

//? os - module
const os = require('os')

Object.keys(os).forEach((key) => {
  v_os[key] = os[key]
})

//? node-os-utils - module
var osu = require('node-os-utils')

Object.keys(osu).forEach((key) => {
  v_os[key] = osu[key]
})

/*
 * Custom functions
 */

//? Method to calculate % of free ram
v_os.freememproc = async () => Math.trunc((v_os.freemem() / v_os.totalmem()) * 100)

module.exports = v_os
