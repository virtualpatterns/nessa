import { Path } from 'mablung'

import It from './library/it'

describe('Code', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('code', 'unbuffered-code.pug'),
      'matchFn': '<li>item</li>'
    },
    {
      'resourcePath': Path.join('code', 'block-unbuffered-code.pug'),
      'matchFn': '<li>Uno</li>'
    },
    {
      'resourcePath': Path.join('code', 'buffered-code.pug'),
      'matchFn': '<p>This code is &lt;escaped&gt;!</p>'
    },
    {
      'resourcePath': Path.join('code', 'buffered-inline-code.pug'),
      'matchFn': '<p>This code is &lt;escaped&gt;!</p>'
    },
  ])

  It.shouldBeUnSupported([
    {
      'resourcePath': Path.join('code', 'unescaped-buffered-inline-code.pug')
    }
  ])

})
