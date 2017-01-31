import It from './library/it'
import Path from '../library/path'

describe('Text', () => {

  It.shouldEqual([
    {
      'path': Path.join('text', 'piped-text.pug'),
      'matchFn': '<div>Plain text can&#39;t include html<p>It must always be on its own line</p></div>'
    },
    {
      'path': Path.join('text', 'inline-tag.pug'),
      'matchFn': '<p>Plain text can&#39;t include html</p>'
    },
    {
      'path': Path.join('text', 'block-tag.pug'),
      'matchFn': '<script>if (usingPug)\n  console.log(\'you are awesome\')\nelse\n  console.log(\'use pug\')</script>'
    },
  ])

})
