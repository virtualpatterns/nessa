import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using code)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'unbuffered-code.pug'),
      'match': '<li>item</li>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'block-unbuffered-code.pug'),
      'match': '<li>Uno</li>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'buffered-code.pug'),
      'match': '<p>This code is &lt;escaped&gt;!</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'buffered-inline-code.pug'),
      'match': '<p>This code is &lt;escaped&gt;!</p>',
      'it': it
    }
  ])

  It.shouldBeUnSupported([
    {
      'templatePath': Path.join(__dirname, 'unescaped-buffered-inline-code.pug'),
      'it': it
    }
  ])

})
