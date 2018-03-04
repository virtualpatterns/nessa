import Address from 'quick-local-ip'
import { Path, Process } from '@virtualpatterns/mablung'

const PORT = 8080

export default {

  'babel': {
    'logPath': `${Process.env.HOME}/Library/Logs/nessa/nessa-babel.log`
  },

  'bundle': {
    'entryPath': Path.join(__dirname, '../source/www/index.html'),
    'options': {
      'cache': false,
      'detailedReport': false,
      'https': false,
      'logLevel': 3,
      'minify': false,
      'outDir': Path.join(__dirname, '../distributables/www'),
      'outFile': Path.join(__dirname, '../distributables/www/index.html'),
      'sourceMaps': true,
      'target': 'browser',
      'watch': false
    }
  },

  'sandbox': {
    'logPath': `${Process.env.HOME}/Library/Logs/nessa/nessa-sandbox.log`
  },

  'server': {
    'address': '0.0.0.0',
    'logPath': `${Process.env.HOME}/Library/Logs/nessa/nessa-server.log`,
    'port': PORT,
    'secondsToNanoseconds': 1e9,
    'secondsToMilliseconds': 1e3,
    'nanosecondsToMilliseconds': 1e-6
  },

  'tasks': {
    'logPath': `${Process.env.HOME}/Library/Logs/nessa/nessa-tasks.log`
  },

  'tests': {
    'logPath': `${Process.env.HOME}/Library/Logs/nessa/nessa-tests.log`,
    'screenshotPath': `${Process.cwd()}/process/screenshots/nessa-tests.png`,
    'serverUrl': `http://${Address.getLocalIP4()}:${PORT}`,
  }

}
