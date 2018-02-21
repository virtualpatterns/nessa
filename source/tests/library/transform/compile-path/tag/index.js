import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using a tag)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'match': '<ul><li>Item A</li><li>Item B</li><li>Item C</li></ul>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'block-expansion.pug'),
      'match': '<a><img></a>',
      'it': it
    }
  ])

  It.shouldBeUnSupported([
    {
      'templatePath': Path.join(__dirname, 'self-closing-tag.pug'),
      'it': it
    }
  ])

})
