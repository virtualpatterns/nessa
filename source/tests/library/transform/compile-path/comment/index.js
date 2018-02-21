import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using a comment)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default-unbuffered.pug'),
      'match': '<p>foo</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'default-buffered.pug'),
      'match': '<p>foo</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'block-buffered-comment.pug'),
      'match': '<body></body>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'block-unbuffered-comment.pug'),
      'match': '<body></body>',
      'it': it
    }
  ])

})
