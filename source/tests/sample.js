import Assert from 'assert'

import It from './library/it'

describe('Sample', () => {

  It.shouldEqual([
    {
      'path': 'index.pug',
      'data': {
        'name': 'virtualpatterns.com'
      },
      'matchFn': () => Assert.ok(false),
      'debug': false,
      'itFn': it.skip
    },
    {
      'path': 'sample.pug',
      'data': {
        'name': 'Forbes'
      },
      'matchFn': '<p>Forbes&#39;s Pug source code!</p>'
    },
  ])

})
