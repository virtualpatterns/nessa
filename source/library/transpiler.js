import Is from '@pwn/is'
import { Log, Path } from '@virtualpatterns/mablung'

import Transform from './transform'

export default function () {
  return {
    pre() {

      if (this.opts.logPath) {
        Log.createFormattedLog(this.opts.logPath)
      } else if (this.opts.isDebugged) {
        Log.createFormattedLog()
      }

    },
    'visitor': {
      CallExpression(path) {

        if (path.node.callee.name == 'require' &&
            path.node.arguments.length == 1 &&
            path.node.arguments[0].value.match(this.opts.test ? (Is.regexp(this.opts.test) ? this.opts.test : new RegExp(this.opts.test)) : /\.pug$/)) {

          Log.debug({
            'this.file.opts.filenameRelative': this.file.opts.filenameRelative,
            'path.node.callee.name': path.node.callee.name,
            'path.node.arguments[0].value': path.node.arguments[0].value
          }, 'CallExpression(path, state) { ... }')

          let resourcePath = Path.resolve(Path.dirname(this.file.opts.filenameRelative), path.node.arguments[0].value)
          let source = Transform.renderPath(resourcePath)

          path.replaceWithSourceString(source)

        }

      }
    }
  }
}
