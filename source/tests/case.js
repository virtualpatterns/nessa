import Assert from 'assert'

import It from './library/it'
import Path from '../library/path'

describe('Case', () => {

  It.shouldEqual([
    {
      'path': Path.join('case', 'default.pug'),
      'matchFn': '<p>you have 10 friends</p>'
    },
    {
      'path': Path.join('case', 'case-fall-through.pug'),
      'matchFn': '<p>you have very few friends</p>'
    },
    {
      'path': Path.join('case', 'case-fall-through-break.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent, null)
      }
    },
    {
      'path': Path.join('case', 'block-expansion.pug'),
      'matchFn': '<p>you have a friend</p>'
    }
  ])


})
