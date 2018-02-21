import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using a case)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'match': '<p>you have 10 friends</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'case-fall-through.pug'),
      'match': '<p>you have very few friends</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'case-fall-through-break.pug'),
      'match': '<p>you have no friends</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'block-expansion.pug'),
      'match': '<p>you have a friend</p>',
      'it': it
    }
  ])


})
