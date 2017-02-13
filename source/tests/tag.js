import { Path } from 'mablung'

import It from './library/it'

describe('Tag', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('tag', 'default.pug'),
      'matchFn': '<ul><li>Item A</li><li>Item B</li><li>Item C</li></ul>'
    },
    {
      'resourcePath': Path.join('tag', 'block-expansion.pug'),
      'matchFn': '<a><img></a>'
    },
  ])

  It.shouldBeUnSupported([
    {
      'resourcePath': Path.join('tag', 'self-closing-tag.pug')
    }
  ])

})
