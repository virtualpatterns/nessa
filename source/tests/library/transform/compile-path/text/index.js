import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using text)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'piped-text.pug'),
      'match': '<div>Plain text can&#39;t include html<p>It must always be on its own line</p></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'inline-tag.pug'),
      'match': '<p>Plain text can&#39;t include html</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'block-tag.pug'),
      'match': '<script>if (usingPug)\n  console.log(\'you are awesome\')\nelse\n  console.log(\'use pug\')</script>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'newline.pug'),
      'match': '<div>Plain text followed by a newline\nshould preserve the newline, etc.</div>',
      'it': it
    }
  ])

})
