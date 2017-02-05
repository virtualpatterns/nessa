const WebPack = require("webpack")

const FileSystem = require('./library/file-system')
const Package = require('./package')
const Path = require('./library/path')

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
        'test': /\.pug$/,
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
