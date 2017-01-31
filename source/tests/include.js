import It from './library/it'
import Path from '../library/path'

describe('Include', () => {

  It.shouldEqual([
    {
      'path': Path.join('include', 'default.pug'),
      'matchFn': '<div><p>Welcome</p></div>'    },
    {
      'path': Path.join('include', 'plain-text.pug'),
      'matchFn': '<div>This is plain text\n</div>'
    },
  ])

})
