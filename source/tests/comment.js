import { Path } from 'mablung'

import It from './library/it'

describe('Comment', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('comment', 'default-unbuffered.pug'),
      'matchFn': '<p>foo</p>',
    },
    {
      'resourcePath': Path.join('comment', 'default-buffered.pug'),
      'matchFn': '<p>foo</p>',
    },
    {
      'resourcePath': Path.join('comment', 'block-buffered-comment.pug'),
      'matchFn': '<body></body>',
    },
    {
      'resourcePath': Path.join('comment', 'block-unbuffered-comment.pug'),
      'matchFn': '<body></body>',
    },
  ])

})
