import Assert from 'assert'
import Is from '@pwn/is'
import { Log, Path } from '@virtualpatterns/mablung'

import { Page } from '../../../browser'

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

  return _data

}

It.shouldEqual = function (tests) {

  for (let test of tests) {

    test.it(`should produce the correct output for '${Path.basename(test.templatePath)}'`, async () => {

      let realContent = await Page.evaluate((path, data = {}) => {
        window.Log.debug('await Page.evaluate((path) => { ... })')

        return window.renderPath(path)
          .then((source) => {

            let virtualTemplate = new Function('data', `return (${source})(data);`)

            let _data = Object.assign({ 'Utilities': window.Utilities }, data)
            let virtualContent = virtualTemplate(_data)

            let realElement = window.Create(virtualContent)

            let parentElement = document.querySelector('.content')
            let childElement = parentElement.firstChild

            if (childElement) {
              parentElement.removeChild(childElement)
            }

            parentElement.appendChild(realElement)

            return parentElement.innerHTML

          })

      }, test.templatePath, this.getData(test.data))

      if (Is.function(test.match)) {
        await Page.$eval('.content *:first-child', test.match)
      } else {
        Log.debug(`It.shouldEqual(tests) { ... }\n\n${realContent}\n`)
        Assert.equal(realContent, test.match)
      }

    })

  }

}

export default It
