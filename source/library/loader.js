import Loader from 'loader-utils'
import { Log } from '@virtualpatterns/mablung'

import Transform from './transform.js'

export default function (content) {

  let options = Loader.getLoaderConfig(this, 'nessa')

  if (options.isDebugged ||
      options.logPath) {

    if (options.logPath) {
      Log.createFormattedLog(options.logPath)
    } else {
      Log.createFormattedLog()
    }

  }

  Log.debug({ 'options': options }, 'export default function (content) { ... }')

  this.cacheable(true)

  return Transform.renderModule(content, { 'path': this.resourcePath })

}
