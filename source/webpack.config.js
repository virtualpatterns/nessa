import { FileSystem, Path } from 'mablung'
import WebPack from "webpack"

import Package from './package'

const LOG_PATH = Path.join(__dirname, 'process', 'logs', `${Package.name}.webpack.log`)

FileSystem.mkdirp.sync(Path.dirname(LOG_PATH))

module.exports = {
  'devtool': 'source-map',
  'entry': {
    'index': [
      Path.join(__dirname, 'www', 'scripts', 'index.js')
    ],
    'test': [
      Path.join(__dirname, 'www', 'scripts', 'test.js')
    ]
  },
  'module': {
    'loaders': [
      {
        'test': /\.webpack.pug$/,
        'loader': Path.join(__dirname, 'library', 'loader'),
      }
    ]
  },
  'output': {
    'filename': '[name].js',
    'path': Path.join(__dirname, 'www', 'scripts', 'bundles')
  },
  plugins: [
    new WebPack.IgnorePlugin(/^winston|\.\/process$/)
  ],
  'nessa': {
    'isDebugged': true,
    'logPath': LOG_PATH,
    'require': {
      'utilities': Path.join(__dirname, 'library', 'utilities')
    }
  }
}