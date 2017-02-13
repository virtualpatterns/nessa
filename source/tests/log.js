import { Log, Path } from 'mablung'

import Package from '../package.json'

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
