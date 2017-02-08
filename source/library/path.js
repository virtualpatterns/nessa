import _Path from 'path'
import IsRelative from 'is-relative'

import Process from './process'

const Path = Object.create(_Path);

Path.isRelative = function(path) {
  return IsRelative(path)
}

Path.trim = function (path) {
  return path.replace(Process.cwd(), '.');
};

module.exports = Path;
