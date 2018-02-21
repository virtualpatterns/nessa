import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using a conditional)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'match': '<div id="user"><h2 class="green">Description</h2><p class="description">foo bar baz</p></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'default-else-if.pug'),
      'match': '<div id="user"><h2 class="blue">Description</h2><p class="description">User has no description,\nwhy not add one...</p></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'default-else.pug'),
      'match': '<div id="user"><h2 class="red">Description</h2><p class="description">User has no description</p></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'unless.pug'),
      'match': '<p>You&#39;re logged in as foo bar baz</p>',
      'it': it
    }
  ])

})
