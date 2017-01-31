import Assert from 'assert'
import CreateContent from 'virtual-dom/create-element'

describe('Sample', () => {

  it('should produce the correct html', () => {
    let virtualContent = require('./sample.pug')({
      'name': 'Forbes'
    })
    let realContent = CreateContent(virtualContent)

    Assert.equal(realContent.outerHTML, '<p>Forbes\'s Pug source code!</p>')

  })

})
