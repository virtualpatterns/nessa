import Loader from 'loader-utils'

import Log from './log'
import Package from '../package.json'
import Transform from './transform.js'

module.exports = function (content) {

  let options = Loader.getLoaderConfig(this, Package.name)

  if (options.debug ||
      options.isDebugged) {
    if (options.logPath) {
      Log.addFile(options.logPath)
    } else {
      Log.addConsole()
    }
  }

  try {

    Log.debug('- module.exports = function (content) { ... }')

    this.cacheable(true)

    return Transform.renderModule(content, {
      'path': this.resourcePath
    }, options)

  }
  finally {

    if (options.debug ||
        options.isDebugged) {
      if (options.logPath) {
        Log.removeFile(options.logPath)
      } else {
        Log.removeConsole()
      }
    }

  }

}
