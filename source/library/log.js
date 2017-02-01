import Is from '@pwn/is'
import IsNode from 'detect-node'
import Pad from 'pad'
import Utilities from 'util'

let Log = null

if (IsNode) {

  const Winston = require('winston')

  Log = Object.create(Winston)

  Log.format = function (...parameters) {

    const Process = require('./process')

    let options = null

    switch (parameters.length) {
      case 0:
        options = {
          'level': 'debug',
          'message': ''
        }
        break
      case 1:
        options = Is.string(parameters[0]) ? {
          'level': 'debug',
          'message': parameters[0]
        } : parameters[0]
        break
      default:
        options = {
          'level': parameters.shift(),
          'message': Utilities.format.apply(Utilities.format, parameters)
        }
    }

    return Utilities.format(
      '%s %d %s %s',
      new Date().toISOString(),
      Process.pid,
      Pad(options.level.toUpperCase(), 5),
      options.message ? options.message : '')

  }

  Log.addConsole = function (level = 'debug') {

    this.add(Winston.transports.Console, {
      'formatter': this.format,
      'level': level,
      'timestamp': true
    })

    this.debug(`- Log.addConsole('${level}') { ... }`)

  }

  Log.removeConsole = function () {
    this.remove(Winston.transports.Console)
  }

  Log.addFile = function (path, level = 'debug') {

    this.add(Winston.transports.File, {
      'name': path,
      'filename': path,
      'formatter': this.format,
      'json': false,
      'level': level,
      'timestamp': true
    })

    this.debug(`- Log.addFile('${path}', '${level}') { ... }`)

  }

  Log.removeFile = function (path) {
    this.remove(path)
  }

  Log.clear()

} else {

  Log = Object.create({})

  Log.log = function(...parameters) {

    let level = parameters.shift().toUpperCase()
    let levelFn = null

    if (window.callPhantom) {
      levelFn = this.logPhantom.bind(this)
    } else {
      switch (level) {
        case 'LOG':
          levelFn = console.log.bind(console)
          break
        case 'ERROR':
          levelFn = console.error.bind(console)
          break
        case 'WARN':
          levelFn = console.warn.bind(console)
          break
        case 'INFO':
          levelFn = console.info.bind(console)
          break
        case 'DEBUG':
          levelFn = console.debug.bind(console)
          break
        default:
          levelFn = console.log.bind(console)
      }
    }

    if (Is.string(parameters[0])) {

      let message = null
      message = Utilities.format.apply(Utilities.format, parameters)

      message = Utilities.format( '%s %s %s',
                                  new Date().toISOString(),
                                  Pad(level, 5),
                                  message || '')

      levelFn(message)

    // } else if (Is.error(parameters[0])) {
    } else if (parameters[0] instanceof Error) {

      let error = parameters[0]

      Log.log(level, '-   error.message=%j', error.message)
      Log.log(level, '-   error.stack ...\n\n%s\n\n', error.stack)

    }
    else {

      let object = parameters.shift()

      let message = null
      message = Utilities.format( '%s %s ...',
                                  new Date().toISOString(),
                                  Pad(level, 5))

      levelFn(`${message}\n`)
      levelFn(`${Utilities.inspect(object, {
        'depth': null
      })}\n`)

    }

  }

  Log.logPhantom = function(message) {
    window.callPhantom({
      'message': message
    })
  }

  Log.error = function(...parameters) {
    parameters.unshift('error')
    this.log.apply(this, parameters)
  }

  Log.warn = function(...parameters) {
    parameters.unshift('warn')
    this.log.apply(this, parameters)
  }

  Log.info = function(...parameters) {
    parameters.unshift('info')
    this.log.apply(this, parameters)
  }

  Log.debug = function(...parameters) {
    parameters.unshift('debug')
    this.log.apply(this, parameters)
  }

}

Log.inspect = function (...parameters) {

  let level = null
  let name = null
  let object = null

  switch (parameters.length) {
    case 0:
      break
    case 1:
      level = 'debug'
      name = 'Log.inspect(...parameters) { ... }'
      object = parameters[0]
      break
    case 2:
      level = 'debug'
      name = parameters[0]
      object = parameters[1]
      break
    default:
      level = parameters[0]
      name = parameters[1]
      object = parameters[2]
  }

  if (Is.string(object)) {
    this.log(level, `- ${name}\n\n${object}\n`)
  } else {
    this.log(level, `- ${name}\n\n${object ? Utilities.inspect(object, {
      'depth': null,
      'showHidden': true
    }) : 'undefined'}\n`)
  }

}

Log.line = function (level = 'debug') {
  this.log(level, '-'.repeat(80))
}


module.exports = Log
