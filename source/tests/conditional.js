import { Path } from 'mablung'

import It from './library/it'

describe('Conditional', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('conditional', 'default.pug'),
      'matchFn': '<div id="user"><h2 class="green">Description</h2><p class="description">foo bar baz</p></div>'
    },
    {
      'resourcePath': Path.join('conditional', 'default-else-if.pug'),
      'matchFn': '<div id="user"><h2 class="blue">Description</h2><p class="description">User has no description,\nwhy not add one...</p></div>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('conditional', 'default-else.pug'),
      'matchFn': '<div id="user"><h2 class="red">Description</h2><p class="description">User has no description</p></div>'
    },
    {
      'resourcePath': Path.join('conditional', 'unless.pug'),
      'matchFn': '<p>You&#39;re logged in as foo bar baz</p>'
    },
  ])

})
