import Is from '@pwn/is'
import { Log, Path } from '@virtualpatterns/mablung'

import Transform from './transform'

Log.createFormattedLog('/Users/fficnar/Library/Logs/nessa/nessa-babel.log')

function setOptions(options) {

  if (!this.options) {

    this.options = options

    if (this.options.isDebugged ||
        this.options.logPath) {

      if (this.options.logPath) {
        Log.createFormattedLog(this.options.logPath)
      } else {
        Log.createFormattedLog()
      }

    }

    Log.debug({ 'options': options }, 'setOptions(options) { ... }')

  }

}

function clearOptions() {

  if (this.options) {
    Log.debug('clearOptions() { ... }')
    this.options = null
  }

}

export default function () {
  return {
    pre(state) {
      this.path = state.opts.filenameRelative
    },
    'visitor': {
      CallExpression(path, state) {

        let options = state.opts || {}

        if (path.node.callee.name == 'require' &&
            path.node.arguments.length == 1 &&
            path.node.arguments[0].value.match(options.test ? (Is.regexp(options.test) ? options.test : new RegExp(options.test)) : /\.pug$/)) {

          setOptions.call(this, options)

          Log.debug({
            'this.path': this.path,
            'path.node.callee.name': path.node.callee.name,
            'path.node.arguments[0].value': path.node.arguments[0].value
          }, 'CallExpression(path, state) { ... }')

          let resourcePath = Path.resolve(Path.dirname(this.path), path.node.arguments[0].value)
          let source = Transform.renderPath(resourcePath)

          path.replaceWithSourceString(source)

        }

      }
    },
    post() {
      clearOptions.call(this)
    }
  }
}
