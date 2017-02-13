import { Path } from 'mablung'

import It from './library/it'

describe('Text', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('text', 'piped-text.pug'),
      'matchFn': '<div>Plain text can&#39;t include html<p>It must always be on its own line</p></div>'
    },
    {
      'resourcePath': Path.join('text', 'inline-tag.pug'),
      'matchFn': '<p>Plain text can&#39;t include html</p>'
    },
    {
      'resourcePath': Path.join('text', 'block-tag.pug'),
      'matchFn': '<script>if (usingPug)\n  console.log(\'you are awesome\')\nelse\n  console.log(\'use pug\')</script>'
    },
    {
      'resourcePath': Path.join('text', 'newline.pug'),
      'matchFn': '<div>Plain text followed by a newline\nshould preserve the newline, etc.</div>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
  ])

})
