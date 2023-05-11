const nodePortScanner = require('node-port-scanner')
const { cache } = require('../core')
const defaultLocation = 'checkLocalPorts'
module.exports = checkLocalPorts = async (loc = defaultLocation) => {
  const data = await nodePortScanner('127.0.0.1', [])
  await cache.set(loc, data)
  return data
}
