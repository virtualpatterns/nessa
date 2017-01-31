import It from './library/it'
import Path from '../library/path'

describe('Tag', () => {

  It.shouldEqual([
    {
      'path': Path.join('tag', 'default.pug'),
      'matchFn': '<ul><li>Item A</li><li>Item B</li><li>Item C</li></ul>'
    },
    {
      'path': Path.join('tag', 'block-expansion.pug'),
      'matchFn': '<a><img></a>'
    },
  ])

  It.shouldBeUnSupported([
    {
      'path': Path.join('tag', 'self-closing-tag.pug')
    }
  ])

})
