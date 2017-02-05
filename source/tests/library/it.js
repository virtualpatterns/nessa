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

    (test.itFn || it)(`should produce the correct output for ${test.resourcePath}`, () => {

      if (test.isDebugged) {
        Log.debug(`- should produce the correct output for ${test.resourcePath}`)
        Log.inspect('data', test.data || {})
      }

      let virtualContent = this.compileResource(test.resourcePath)(test.data || {})
      let realContent = VirtualNodeToHTML(virtualContent)

      if (test.isDebugged) {
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

It.compileResource = function(resourcePath) {
  return Transform.compilePath(Path.join(RESOURCES_PATH, resourcePath), Configuration[Package.name])
}

It.shouldBeUnSupported = function (tests) {

  tests.forEach((test) => {

    (test.itFn || it)(`should be unsupported for ${test.resourcePath}`, () => {

      if (test.isDebugged) {
        Log.debug(`- should be unsupported for ${test.resourcePath}`)
        Log.inspect('data', test.data || {})
      }

      Assert.throws(() => {
        this.compileResource(test.resourcePath)(test.data || {})
      }, UnSupportedError)

    })

  })

}

module.exports = It
