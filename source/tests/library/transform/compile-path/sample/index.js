import { Path } from '@virtualpatterns/mablung'

import It from '../it'
import Transform from '../../../../../library/transform'

describe('(when using samples)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'data': {
        'name': 'Forbes'
      },
      'match': '<p>Forbes&#39;s Pug source code!</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'list.pug'),
      'data': () => {
        return {
          'Item': Transform.compilePath(Path.join(__dirname, 'item.pug')),
          'items': [ 'red', 'blue', 'green' ]
        }
      },
      'match': '<div><h1>Welcome</h1><ul><li>red</li><li>blue</li><li>green</li></ul></div>',
      'it': it
    }
  ])

})
