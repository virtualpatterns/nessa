'use strict';

var _mablung = require('mablung');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _package = require('./package');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOG_PATH = _mablung.Path.join(__dirname, 'process', 'logs', _package2.default.name + '.webpack.log');

_mablung.FileSystem.mkdirp.sync(_mablung.Path.dirname(LOG_PATH));

module.exports = {
  'devtool': 'source-map',
  'entry': {
    'index': [_mablung.Path.join(__dirname, 'www', 'scripts', 'index.js')],
    'test': [_mablung.Path.join(__dirname, 'www', 'scripts', 'test.js')]
  },
  'module': {
    'loaders': [{
      'test': /\.webpack.pug$/,
      'loader': _mablung.Path.join(__dirname, 'library', 'loader')
    }]
  },
  'output': {
    'filename': '[name].js',
    'path': _mablung.Path.join(__dirname, 'www', 'scripts', 'bundles')
  },
  plugins: [new _webpack2.default.IgnorePlugin(/^winston|\.\/process$/)],
  'nessa': {
    'isDebugged': true,
    'logPath': LOG_PATH,
    'require': {
      'utilities': _mablung.Path.join(__dirname, 'library', 'utilities')
    }
  }
};