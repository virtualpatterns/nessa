import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using samples)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'data': {
        'name': 'Forbes'
      },
      'match': '<p>Forbes\'s Pug source code!</p>',
      'it': it
    }
  ])

})
