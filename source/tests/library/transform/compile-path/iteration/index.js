import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using iteration)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'each.pug'),
      'match': '<ul><li>1</li><li>2</li><li>3</li></ul>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'each-index.pug'),
      'match': '<ul><li>0: zero</li><li>1: one</li><li>2: two</li></ul>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'each-keys.pug'),
      'match': '<ul><li>1: one</li><li>2: two</li><li>3: three</li></ul>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'each-variable.pug'),
      'match': '<ul><li>There are no values</li></ul>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'each-else.pug'),
      'match': '<ul><li>There are no values</li></ul>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'while.pug'),
      'match': '<ul><li>0</li><li>1</li><li>2</li></ul>',
      'it': it
    }
  ])

})
