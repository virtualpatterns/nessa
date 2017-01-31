import It from './library/it'
import Path from '../library/path'

describe('Comment', () => {

  It.shouldEqual([
    {
      'path': Path.join('comment', 'default-unbuffered.pug'),
      'matchFn': '<p>foo</p>',
    },
    {
      'path': Path.join('comment', 'default-buffered.pug'),
      'matchFn': '<p>foo</p>',
    },
    {
      'path': Path.join('comment', 'block-buffered-comment.pug'),
      'matchFn': '<body></body>',
    },
    {
      'path': Path.join('comment', 'block-unbuffered-comment.pug'),
      'matchFn': '<body></body>',
    },
  ])

})
