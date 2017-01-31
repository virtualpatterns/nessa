import It from './library/it'

describe('Sample', () => {

  It.shouldEqual([
    {
      'path': 'index.pug',
      'matchFn': '',
      'debug': true,
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
