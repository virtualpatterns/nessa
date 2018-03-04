import Assert from 'assert'
import { transform as Compile } from 'babel-core'
import { Path } from '@virtualpatterns/mablung'

describe('transpiler', () => {

  let source = null

  before(async () => {

    source = Compile(`require('${Path.join(__dirname, 'index.pug')}')`, {
      'plugins': [ Path.join(__dirname, '../../../library/transpiler') ],
      'presets': [ 'env' ]
    }).code

  })

  it('should ...', async () => {
    Assert.equal(source, `'use strict';

(function _render(data) {
  var result_of_with = function (Utilities) {
    var _utilities = Utilities;
    var _nodes = [];
    _nodes = _nodes.concat(_utilities.createTag('p', null, null));
    return {
      value: _nodes[0]
    };
  }.call(this, 'Utilities' in data ? data.Utilities : typeof Utilities !== 'undefined' ? Utilities : undefined);

  if (result_of_with) return result_of_with.value;
});`)

  })

})
