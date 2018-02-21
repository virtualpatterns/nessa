import Assert from 'assert'
import Is from '@pwn/is'
import { Log, Path } from '@virtualpatterns/mablung'
import VirtualNodeToHTML from 'vdom-to-html'

import Transform from '../../../../library/transform'
import Utilities from '../../../../library/utilities'

import UnSupportedError from '../../../../library/errors/unsupported-error'

const It = Object.create({})

It.getData = function (data) {

  let _data = {}

  if (data) {
    if (Is.function(data)) {
      _data = data()
    } else {
      _data = data
    }
  }

  return Object.assign({ Utilities }, _data)

}

It.shouldEqual = function (tests) {

  for (let test of tests) {

    test.it(`should produce the correct output for '${Path.basename(test.templatePath)}'`, () => {

      let virtualContent = Transform.compilePath(test.templatePath)(this.getData(test.data))
      let realContent = VirtualNodeToHTML(virtualContent)

      Log.debug({ 'virtualContent': virtualContent })
      Log.debug(`\n\n${realContent}\n`)

      if (Is.function(test.match)) {
        test.match(virtualContent, realContent)
      } else {
        Assert.equal(realContent, test.match)
      }

    })

  }

}

It.shouldBeUnSupported = function (tests) {

  for (let test of tests) {
    test.it(`should be unsupported for '${Path.basename(test.templatePath)}'`, () => {
      Assert.throws(() => Transform.compilePath(test.templatePath), UnSupportedError)
    })
  }

}

export default It
