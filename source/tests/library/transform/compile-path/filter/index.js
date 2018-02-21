import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using filters)', () => {

  // NOTE:  The parentTag attribute is required if the filter results
  //        contain HTML.  See the .pug files in these tests.

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'match': '<div><h1>Markdown</h1>\n</div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'inline-syntax-tag.pug'),
      'match': '<div><strong>BOLD TEXT</strong></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'inline-syntax-interpolation.pug'),
      'match': '<p>In the midst of a large amount of plain\ntext, suddenly a wild <span><em>Markdown</em></span>\nappeared.</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'nested-filter.pug'),
      'match': '<script>//<![CDATA[\n\'use strict\';\n\nvar myFunc = function myFunc() {\n  return \'This is ES2015 in a CD\' + \'ATA\';\n};\n//]]></script>',
      'it': it
    }
  ])

})
