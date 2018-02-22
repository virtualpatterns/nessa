import Address from 'quick-local-ip'
import { Process } from '@virtualpatterns/mablung'

const PORT = 8080

export default {

  'babel': {
    'logPath': `${Process.env.HOME}/Library/Logs/nessa/nessa-babel.log`
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
