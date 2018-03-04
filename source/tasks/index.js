import 'babel-polyfill'
import Bundler from 'parcel-bundler'
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

desc('Count the number of dirty files')
task('count', [], { 'async': true }, () => {
  Jake.exec([ 'bin/find-dirty-files' ], { 'printStderr': true, 'printStdout': true }, () => complete())
})

desc('Lint files')
task('lint', [], { 'async': true }, () => {
  Jake.exec([ 'eslint --ignore-path .gitignore --ignore-pattern source/configuration.js --ignore-pattern source/tasks source' ], { 'printStderr': true, 'printStdout': true }, () => complete())
})

desc('Build files')
task('build', [ 'clean', 'count', 'lint' ], { 'async': true }, () => {
  Jake.exec([
    ...([ 'library', 'sandbox', 'server', 'tests' ].map((folderName) => `babel source/${folderName} --copy-files --out-dir distributables/${folderName} --quiet --source-maps`)),
    ...([ 'index.js' ].map((fileName) => `babel source/${fileName} --out-file distributables/${fileName} --quiet --source-maps`))
  ], { 'printStderr': true, 'printStdout': true }, () => complete())
})

desc('Bundle files')
task('bundle', [ 'lint' ], { 'async': true }, () => {

  Jake.rmRf('distributables/www', { 'silent': true })

  new Bundler(Configuration.bundle.entryPath, Configuration.bundle.options)
    .bundle()
    .then(() => complete())

})

desc('Run server')
task('run', [ 'build' ], { 'async': true }, () => {

  Jake.rmRf(Configuration.server.logPath, { 'silent': true })

  Jake.exec([
    'clear',
    'node distributables/server/index.js'
  ], { 'printStderr': true, 'printStdout': true }, () => complete())

})

// desc('Bundle files, watch for changes')
// task('watch', [ 'lint' ], { 'async': true }, () => {
//
//   Jake.rmRf(Configuration.babel.logPath, { 'silent': true })
//   Jake.rmRf('distributables/www', { 'silent': true })
//
//   Jake.exec([
//     'clear',
//     'parcel watch source/www/index.html --no-cache --out-dir distributables/www'
//   ], { 'printStderr': true, 'printStdout': true }, () => complete())
//
// })

desc('Run tests')
task('test', [ 'build' ], { 'async': true }, () => {

  Jake.rmRf(Configuration.tests.logPath, { 'silent': true })
  Jake.rmRf(Configuration.tests.screenshotPath, { 'silent': true })

  Jake.exec([
    'clear',
    'mocha --bail --timeout 0 distributables/tests/index.js'
  ], { 'printStderr': true, 'printStdout': true }, () => complete())

})

desc('Publish package')
task('publish', [ 'test' ], { 'async': true }, () => {
  Jake.exec([
    'npm publish --access public',
    'npm --no-git-tag-version version patch',
    'git add package.json',
    'git commit --message="Increment version"'
  ], { 'printStderr': true, 'printStdout': true }, () => complete())
})

Jake.addListener('complete', () => {
  Log.debug('Jake.addListener(\'complete\', () => { ... })')
})
