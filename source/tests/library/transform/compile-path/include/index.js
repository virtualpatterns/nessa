import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using include)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'match': '<div><p>Welcome</p></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'plain-text.pug'),
      'match': '<div>This is plain text\n</div>',
      'it': it
    }
  ])

})
