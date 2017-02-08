import Assert from 'assert'

import It from './library/it'
import Path from '../library/path'

describe('Sample', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('sample', 'default.pug'),
      'data': {
        'name': 'Forbes'
      },
      'matchFn': '<p>Forbes&#39;s Pug source code!</p>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('sample', 'list.pug'),
      'data': {
        'Item': It.compileResource(Path.join('sample', 'item.pug')),
        items: [
          'red',
          'blue',
          'green'
        ]
      },
      'matchFn': '<div><h1>Welcome</h1><ul><li>red</li><li>blue</li><li>green</li></ul></div>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
  ])

})
