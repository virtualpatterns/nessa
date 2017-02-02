import Assert from 'assert'
import Is from '@pwn/is'
import VirtualNodeToHTML from 'vdom-to-html'

import Configuration from '../../webpack.config'
import Log from '../../library/log'
import Path from '../../library/path'
import Package from '../../package.json'
import Transform from '../../library/transform'

import UnSupportedError from '../../library/errors/unsupported-error'

const RESOURCES_PATH = Path.join(__dirname, '..', 'resources')

let It = Object.create({})

It.shouldEqual = function (tests) {

  tests.forEach((test) => {

    (test.itFn || it)(`should produce the correct output for ${test.path}`, () => {

      if (test.debug) {
        Log.debug(`- should produce the correct output for ${test.path}`)
        Log.inspect('data', test.data || {})
      }

      let virtualContent = Transform.compilePath(Path.join(RESOURCES_PATH, test.path), Configuration[Package.name])(test.data || {})
      let realContent = VirtualNodeToHTML(virtualContent)

      if (test.debug) {
        Log.inspect('virtualContent', virtualContent)
        Log.inspect('realContent', realContent)
      }

      if (Is.function(test.matchFn)) {
        test.matchFn(virtualContent, realContent, Configuration[Package.name])
      } else {
        Assert.equal(realContent, test.matchFn)
      }

    })

  })

}

It.shouldBeUnSupported = function (tests) {

  tests.forEach((test) => {

    (test.itFn || it)(`should be unsupported for ${test.path}`, () => {
      Assert.throws(() => {
        Transform.compilePath(Path.join(RESOURCES_PATH, test.path), Configuration[Package.name])(test.data || {})
      }, UnSupportedError)
    })

  })

}

module.exports = It
