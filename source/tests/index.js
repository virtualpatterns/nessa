import 'babel-polyfill'
import { Log } from '@virtualpatterns/mablung'

import Configuration from '../configuration'

before(() => {
  Log.createFormattedLog(Configuration.tests.logPath)
  Log.debug('before (() => { ... })')
})

require('./library/index')
require('./www/index')

after(() => {
  Log.debug('after(() => { ... })')
})
