import Loader from 'loader-utils'
import { Log } from 'mablung'

import Package from '../package.json'
import Transform from './transform.js'

// module.exports = function (content) {
export default function (content) {

  let options = Loader.getLoaderConfig(this, Package.name)

  // Log.clear()

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
    Log.inspect('options', options)

    this.cacheable(true)

    return Transform.renderModule(content, {
      'path': this.resourcePath
    }, {
      'isInline': false,
      'require': {
        'utilities': options.require && options.require.utilities ? options.require.utilities : undefined
      }
    })

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
