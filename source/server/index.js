import { FileSystem, Log, Path, Process } from 'mablung'
import Server from 'restify'

import Package from '../package.json'

const LOG_PATH = Path.join(__dirname, '..', 'process', 'logs', `${Package.name}.server.log`)
const PORT = 8082
const REGEXP_MOCHA = /^\/www\/vendor\/mocha\/(.*)$/
const REGEXP_STATIC = /^\/www\/(.*)$/

FileSystem.mkdirp.sync(Path.dirname(LOG_PATH))

Log.clear()
Log.addConsole()
Log.addFile(LOG_PATH)
Log.line()

const server = Server.createServer()

server.on('uncaughtException', (request, response, route, error) => {
  Log.debug(`- server.on('uncaughtException', (request, response, route, error) => { ... })\n\n${error.stack}\n`)
  response.send(error)
})

server.use((request, response, next) => {
  Log.debug(`- ${request.method} ${request.url}`);
  next();
});

server.get('/favicon.ico', (request, response, next) => {
  Server.serveStatic({
    'directory': Path.join(__dirname, '..', 'www', 'resources'),
    'file': `application.ico`,
    'maxAge': 0
  })(request, response, next)
})

server.get('/', (request, response, next) => {
  response.redirect('/www/index.html', next)
})

server.get('/www', (request, response, next) => {
  response.redirect('/www/index.html', next)
})

server.get(REGEXP_MOCHA, (request, response, next) => {
  Server.serveStatic({
    'directory': Path.join(__dirname, '..', 'node_modules', 'mocha'),
    'file': request.params[0],
    'maxAge': 0
  })(request, response, next)
})

server.get(REGEXP_STATIC, (request, response, next) => {
  Server.serveStatic({
    'directory': Path.join(__dirname, '..', 'www'),
    'file': request.params[0],
    'maxAge': 0
  })(request, response, next)
})

server.listen(PORT, () => {
  Log.debug(`- server.listen(${PORT}, () => { ... })`)
})
