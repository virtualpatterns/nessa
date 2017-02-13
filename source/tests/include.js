import { Path } from 'mablung'

import It from './library/it'

describe('Include', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('include', 'default.pug'),
      'matchFn': '<div><p>Welcome</p></div>'    },
    {
      'resourcePath': Path.join('include', 'plain-text.pug'),
      'matchFn': '<div>This is plain text\n</div>'
    },
  ])

})
