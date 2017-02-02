const Log = require('../library/log')
const Package = require('../package.json')
const Path = require('../library/path')

const LOG_PATH = Path.join(__dirname, '..', 'process', 'logs', `${Package.name}.mocha.log`)

before(() => {
  Log.clear()
  Log.addFile(LOG_PATH)
  // Log.line()
})

after(() => {
  // Log.line()
  Log.removeFile(LOG_PATH)
})

// Log.inspect('virtualContent', virtualContent)
// Log.inspect('realContent', realContent)
