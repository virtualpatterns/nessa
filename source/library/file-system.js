import Directory from 'mkdirp'
import _FileSystem from 'fs'
import Promisify from 'es6-promisify'
import Touch from 'touch'

import Log from './log'
import Path from './path'
import Process from './process'

import ArgumentError from './errors/argument-error'
import ProcessError from './errors/process-error'

let FileSystem = Object.create(_FileSystem)

FileSystem.mkdirp = Directory
FileSystem.touch = Touch

FileSystem.accessUnlink = function (path, mode, callback) {
  FileSystem.access(path, mode, error => {
    if (error) {
      callback()
    } else {
      FileSystem.unlink(path, callback)
    }
  })
}

FileSystem.whenFileExists = function (timeout, maximumDuration, path) {

  // import Log from './log'
  // import Process from './process'

  Log.debug('- FileSystem.whenFileExists(%d, %d, %j) { ... }', timeout, maximumDuration, Path.trim(path))

  return Process.when(timeout, maximumDuration, callback => FileSystem.access(path, FileSystem.F_OK, callback))

}

FileSystem.whenFileNotExists = function (timeout, maximumDuration, path) {

  // import Log from './log'
  // import Process from './process'

  Log.debug('- FileSystem.whenFileNotExists(%d, %d, %j) { ... }', timeout, maximumDuration, Path.trim(path))

  return Process.when(timeout, maximumDuration, callback => {
    FileSystem.access(path, FileSystem.F_OK, error => {
      if (error) {
        callback()
      } else {
        callback(new ArgumentError(`The file ${ Path.trim(path) } exists.`))
      }
    })
  })

}

FileSystem.Promise = {}
FileSystem.Promise.access = Promisify(FileSystem.access)
FileSystem.Promise.accessUnlink = Promisify(FileSystem.accessUnlink)
FileSystem.Promise.mkdirp = Promisify(FileSystem.mkdirp)
FileSystem.Promise.readFile = Promisify(FileSystem.readFile)
FileSystem.Promise.touch = Promisify(FileSystem.touch)
FileSystem.Promise.unlink = Promisify(FileSystem.unlink)
FileSystem.Promise.writeFile = Promisify(FileSystem.writeFile)


module.exports = FileSystem
