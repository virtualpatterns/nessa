import It from './library/it'
import Path from '../library/path'

describe('Code', () => {

  It.shouldEqual([
    {
      'path': Path.join('code', 'unbuffered-code.pug'),
      'matchFn': '<li>item</li>'
    },
    {
      'path': Path.join('code', 'block-unbuffered-code.pug'),
      'matchFn': '<li>Uno</li>'
    },
    {
      'path': Path.join('code', 'buffered-code.pug'),
      'matchFn': '<p>This code is &lt;escaped&gt;!</p>'
    },
    {
      'path': Path.join('code', 'buffered-inline-code.pug'),
      'matchFn': '<p>This code is &lt;escaped&gt;!</p>'
    },
  ])

  It.shouldBeUnSupported([
    {
      'path': Path.join('code', 'unescaped-buffered-inline-code.pug')
    }
  ])

})
