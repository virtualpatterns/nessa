import Is from '@pwn/is'

import Log from './log'
import Package from '../package.json'
import Path from './path'
import Process from './process'
import Transform from './transform'

function setOptions(options) {

  if (!this.options) {
    // console.log(`- setOptions(options) { ... } this.options=${this.options}`)

    this.options = options

    if (this.options.isDebugged) {
      if (this.options.logPath) {
        Log.addFile(this.options.logPath)
      } else {
        Log.addConsole()
      }
    }

    Log.debug('- setOptions(options) { ... }')
    Log.inspect('options', options)

  }

}

function clearOptions() {

  if (this.options) {
    // console.log('- clearOptions() { ... }')
    Log.debug('- clearOptions() { ... }')

    if (this.options.isDebugged) {
      if (this.options.logPath) {
        Log.removeFile(this.options.logPath)
      } else {
        Log.removeConsole()
      }
    }

    this.options = null

  }


}

module.exports = function ({ 'types': Types }) {
  return {
    pre(state) {
      // console.log('- pre(state) { ... }')
      this.path = state.opts.filenameRelative
    },
    'visitor': {
      CallExpression(path, state) {
        // console.log('- CallExpression(path, state) { ... }')

        let options = state.opts || {}

        if (path.node.callee.name == 'require' &&
            path.node.arguments.length == 1 &&
            path.node.arguments[0].value.match(options.test ? (Is.regexp(options.test) ? options.test : new RegExp(options.test)) : /\.pug$/)) {

          setOptions.call(this, options)

          Log.debug('- CallExpression(path, state) { ... }')
          Log.debug(`- this.path='${this.path}'`)
          Log.debug(`- path.node.callee.name=${path.node.callee.name ? `'${path.node.callee.name}'` : path.node.callee.name}`)
          Log.debug(`- path.node.arguments[0].value='${path.node.arguments[0].value}'`)

          let resourcePath = Path.resolve(Path.dirname(this.path), path.node.arguments[0].value)

          Log.debug(`- resourcePath='${resourcePath}'`)

          let source = Transform.renderPath(resourcePath, {
            'isInline': true,
            'require': {
              'utilities': options.require && options.require.utilities ? options.require.utilities : undefined
            }
          })

          Log.inspect('path.replaceWithSourceString(source)', source)

          path.replaceWithSourceString(source)

        }

      }
    },
    post(state) {
      // console.log('- post(state) { ... }')
      clearOptions.call(this)
    }
  }
}
