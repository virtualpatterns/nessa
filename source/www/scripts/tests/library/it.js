import Assert from 'assert'
import CreateContent from 'virtual-dom/create-element'
import Is from '@pwn/is'
import Log from 'mablung/library/log'

const It = Object.create({})

It.shouldEqual = function (tests) {

  tests.forEach((test) => {

    (test.itFn || it)(`should produce the correct output for ${test.resourcePath}`, () => {

      if (test.isDebugged) {
        Log.debug(`should produce the correct output for ${test.resourcePath}`)
        Log.inspect('data', test.data || {})
      }

      let virtualContent = test.virtualContentFn(test.data || {})
      let realContent = CreateContent(virtualContent)

      if (test.isDebugged) {
        Log.inspect('virtualContent', virtualContent)
        Log.inspect('realContent.outerHTML', realContent.outerHTML)
      }

      if (Is.function(test.matchFn)) {
        test.matchFn(virtualContent, realContent)
      } else {
        Assert.equal(realContent.outerHTML, test.matchFn)
      }

    })

  })

}

module.exports = It
