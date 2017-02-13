import { Path } from 'mablung'

import It from './library/it'

describe('Iteration', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('iteration', 'each.pug'),
      'matchFn': '<ul><li>1</li><li>2</li><li>3</li></ul>'
    },
    {
      'resourcePath': Path.join('iteration', 'each-index.pug'),
      'matchFn': '<ul><li>0: zero</li><li>1: one</li><li>2: two</li></ul>'
    },
    {
      'resourcePath': Path.join('iteration', 'each-keys.pug'),
      'matchFn': '<ul><li>1: one</li><li>2: two</li><li>3: three</li></ul>'
    },
    {
      'resourcePath': Path.join('iteration', 'each-variable.pug'),
      'matchFn': '<ul><li>There are no values</li></ul>'
    },
    {
      'resourcePath': Path.join('iteration', 'each-else.pug'),
      'matchFn': '<ul><li>There are no values</li></ul>'
    },
    {
      'resourcePath': Path.join('iteration', 'while.pug'),
      'matchFn': '<ul><li>0</li><li>1</li><li>2</li></ul>'
    },
  ])

})
