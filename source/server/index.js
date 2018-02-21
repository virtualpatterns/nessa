import { Log, Path, Process } from '@virtualpatterns/mablung'
import REST from 'restify'
import RESTPlugins from 'restify-plugins'

import Configuration from '../configuration'

const REGEXP_STATIC = /^\/www\/(.*)$/

Log.createFormattedLog(Configuration.server.logPath)
// Log.debug({ 'Configuration': Configuration })

const server = REST.createServer()

server.on('restifyError', (request, response, error, callback) => {
  Log.error('server.on(\'restifyError\', (request, response, error, callback) => { ... })')
  Log.error(error)
  return callback()
})

server.use((request, response, next) => {

  let timer = Process.hrtime()
  Log.debug(`> ${request.method} ${request.url}`)

  function onFinish () {
    let duration = Process.hrtime(timer)
    Log.debug(`< ${request.method} ${request.url} ${response.statusCode} ${response.get('Content-Length') || 0}b ${duration[0] * Configuration.server.secondsToMilliseconds + duration[1] * Configuration.server.nanosecondsToMilliseconds}ms`)
    removeAllListeners()
  }

  function onClose () {
    Log.debug(`< ${request.method} ${request.url} CLOSE`)
    removeAllListeners()
  }

  function removeAllListeners () {
    response.removeListener('finish', onFinish)
    response.removeListener('close', onClose)
  }

  response.on('finish', onFinish)
  response.on('close', onClose)

  return next()

})

server.get('/favicon.ico', (request, response, next) => {
  RESTPlugins.serveStatic({
    'directory': Path.join(__dirname, '..', 'www', 'resources'),
    'file': 'application.ico',
    'maxAge': 0
  })(request, response, next)
})

server.get('/', (request, response, next) => {
  response.redirect('/www/index.html', next)
})

server.get('/www', (request, response, next) => {
  response.redirect('/www/index.html', next)
})

server.get(REGEXP_STATIC, (request, response, next) => {
  RESTPlugins.serveStatic({
    'directory': Path.join(__dirname, '..', 'www'),
    'file': request.params[0],
    'maxAge': 0
  })(request, response, next)
})

server.get('/finish', (request, response, next) => {
  response.send(200, {})
  return next()
})

server.get('/close', () => {})

server.listen(Configuration.server.port, Configuration.server.address, () => {
  Log.debug(`server.listen(${Configuration.server.port}, '${Configuration.server.address}', () => { ... })`)
  console.log(`Listening at http://${Configuration.server.address}:${Configuration.server.port} ...`) // eslint-disable-line no-console
})

// import { FileSystem, Log, Path } from 'mablung'
// import Server from 'restify'
//
// import Package from '../package.json'
//
// const LOG_PATH = Path.join(__dirname, '..', 'process', 'logs', `${Package.name}.server.log`)
// const PORT = 8082
// const REGEXP_MOCHA = /^\/www\/vendor\/mocha\/(.*)$/
// const REGEXP_STATIC = /^\/www\/(.*)$/
//
// FileSystem.mkdirp.sync(Path.dirname(LOG_PATH))
//
// // Log.clear()
// Log.addConsole()
// Log.addFile(LOG_PATH)
// // Log.line()
//
// const server = Server.createServer()
//
// server.on('uncaughtException', (request, response, route, error) => {
//   Log.debug(`- server.on('uncaughtException', (request, response, route, error) => { ... })\n\n${error.stack}\n`)
//   response.send(error)
// })
//
// server.use((request, response, next) => {
//   Log.debug(`- ${request.method} ${request.url}`)
//   next()
// })
//
// server.get('/favicon.ico', (request, response, next) => {
//   Server.serveStatic({
//     'directory': Path.join(__dirname, '..', 'www', 'resources'),
//     'file': 'application.ico',
//     'maxAge': 0
//   })(request, response, next)
// })
//
// server.get('/', (request, response, next) => {
//   response.redirect('/www/index.html', next)
// })
//
// server.get('/www', (request, response, next) => {
//   response.redirect('/www/index.html', next)
// })
//
// server.get(REGEXP_MOCHA, (request, response, next) => {
//   Server.serveStatic({
//     'directory': Path.join(__dirname, '..', 'node_modules', 'mocha'),
//     'file': request.params[0],
//     'maxAge': 0
//   })(request, response, next)
// })
//
// server.get(REGEXP_STATIC, (request, response, next) => {
//   Server.serveStatic({
//     'directory': Path.join(__dirname, '..', 'www'),
//     'file': request.params[0],
//     'maxAge': 0
//   })(request, response, next)
// })
//
// server.listen(PORT, () => {
//   Log.debug(`- server.listen(${PORT}, () => { ... })`)
// })
