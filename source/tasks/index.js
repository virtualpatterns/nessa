import 'babel-polyfill'
import Jake from 'jake'
import { Log } from '@virtualpatterns/mablung'

import Configuration from '../configuration'

Jake.addListener('start', () => {
  Jake.rmRf(Configuration.tasks.logPath, { 'silent': true })
  Log.createFormattedLog(Configuration.tasks.logPath)
  Log.debug('Jake.addListener(\'start\', () => { ... })')
})

desc('Remove built and bundled folders and files')
task('clean', [], { 'async': false }, () => {

  Jake.rmRf('distributables/library', { 'silent': true })
  Jake.rmRf('distributables/sandbox', { 'silent': true })
  Jake.rmRf('distributables/server', { 'silent': true })
  Jake.rmRf('distributables/tests', { 'silent': true })
  Jake.rmRf('distributables/index.js', { 'silent': true })
  Jake.rmRf('distributables/index.js.map', { 'silent': true })

})

desc('Lint files')
task('lint', [], { 'async': true }, () => {
  Jake.exec([ 'eslint --ignore-path .gitignore --ignore-pattern source/configuration.js --ignore-pattern source/tasks source' ], { 'printStderr': true, 'printStdout': true }, () => complete())
})

desc('Build files')
task('build', [ 'clean', 'lint' ], { 'async': true }, () => {
  Jake.exec([
    ...([ 'library', 'sandbox', 'server', 'tests' ].map((folderName) => `babel source/${folderName} --copy-files --out-dir distributables/${folderName} --quiet --source-maps`)),
    ...([ 'index.js' ].map((fileName) => `babel source/${fileName} --out-file distributables/${fileName} --quiet --source-maps`))
  ], { 'printStderr': true, 'printStdout': true }, () => complete())
})

desc('Bundle files, watch for changes')
task('watch', [ 'lint' ], { 'async': true }, () => {

  Jake.rmRf(Configuration.babel.logPath, { 'silent': true })
  Jake.rmRf('distributables/www', { 'silent': true })

  Jake.exec([
    'clear',
    'parcel watch source/www/index.html --no-cache --out-dir distributables/www'
  ], { 'printStderr': true, 'printStdout': true }, () => complete())

})

desc('Run tests')
task('test', [ 'build' ], { 'async': true }, () => {

  Jake.rmRf(Configuration.tests.logPath, { 'silent': true })
  Jake.rmRf(Configuration.tests.screenshotPath, { 'silent': true })

  Jake.exec([
    'clear',
    'mocha --bail --timeout 0 distributables/tests/index.js'
  ], { 'printStderr': true, 'printStdout': true }, () => complete())

})

desc('Run server')
task('run', [ 'build' ], { 'async': true }, () => {

  Jake.rmRf(Configuration.server.logPath, { 'silent': true })

  Jake.exec([
    'clear',
    'node distributables/server/index.js'
  ], { 'printStderr': true, 'printStdout': true }, () => complete())

})

// "scripts": {
//   "link": "hln ./process/logs \"$HOME/Library/Logs/nessa\"",
//   "unlink": "hln -u \"$HOME/Library/Logs/nessa\"",
//   "upgrade": "npm-check-updates --upgrade",
//   "clean": "npm run pre-clean && npm run post-clean",
//   "pre-clean": "rm -rf ./library ./process/logs/nessa.babel.log",
//   "post-clean": "rm -rf ./process/logs/nessa.webpack.log ./server ./tests ./www",
//   "lint": "eslint ./resources ./source",
//   "build": "npm run lint && npm run pre-build && npm run post-build",
//   "pre-build": "npm run pre-clean && BABEL_ENV=pre-build babel ./source/library --copy-files --out-dir ./library",
//   "post-build": "npm run post-clean && BABEL_ENV=post-build babel ./source --copy-files --ignore ./source/library --out-dir . && rm -f ./process/logs/nessa.webpack.log && webpack",
//   "test": "npm run test-library && npm run test-www",
//   "test-library": "rm -rf ./coverage ./process/logs/nessa.mocha.log && npm run build && istanbul cover ./node_modules/.bin/_mocha --dir ./coverage -- --bail --timeout 0 ./tests",
//   "test-www": "rm -rf ./process/logs/nessa.www.log && npm run build && mocha-phantomjs --bail --hooks ./resources/hooks.js --ignore-resource-errors --path ./node_modules/.bin/phantomjs http://localhost:8082/www/test.html",
//   "run": "rm -rf ./process/logs/nessa.server.log && npm run build && node server/index.js",
//   "debug-test-library": "rm -rf ./coverage ./process/logs/nessa.mocha.log && npm run build && node-debug ./node_modules/.bin/_mocha --bail --timeout 0 ./tests",
//   "debug-run": "rm -rf ./process/logs/nessa.server.log && npm run build && node-debug server/index.js"
// },

Jake.addListener('complete', () => {
  Log.debug('Jake.addListener(\'complete\', () => { ... })')
})
