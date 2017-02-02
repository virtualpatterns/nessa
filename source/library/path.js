import _Path from 'path'
import Resolve from 'resolve-path'

import Process from './process'

let Path = Object.create(_Path);

Path.resolve = function (path) {
  return this.isAbsolute(path) ? path : Resolve(path);
};

Path.trim = function (path) {
  return path.replace(Process.cwd(), '.');
};

module.exports = Path;
