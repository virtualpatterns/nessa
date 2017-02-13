import Assert from 'assert'
import { Path } from 'mablung'

import It from './library/it'

describe('Case', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('case', 'default.pug'),
      'matchFn': '<p>you have 10 friends</p>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('case', 'case-fall-through.pug'),
      'matchFn': '<p>you have very few friends</p>'
    },
    {
      'resourcePath': Path.join('case', 'case-fall-through-break.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent, null)
      }
    },
    {
      'resourcePath': Path.join('case', 'block-expansion.pug'),
      'matchFn': '<p>you have a friend</p>'
    }
  ])


})
