import It from './library/it'
import Path from '../library/path'

describe('Filter', () => {

// NOTE:  The parentTag attribute is required if the filter results
//        contain HTML.  See the .pug files in these tests.

  It.shouldEqual([
    {
      'resourcePath': Path.join('filter', 'default.pug'),
      'matchFn': '<div><h1>Markdown</h1>\n</div>'
    },
    {
      'resourcePath': Path.join('filter', 'inline-syntax-tag.pug'),
      'matchFn': '<div><strong>BOLD TEXT</strong></div>'
    },
    {
      'resourcePath': Path.join('filter', 'inline-syntax-interpolation.pug'),
      'matchFn': '<p>In the midst of a large amount of plain\ntext, suddenly a wild <span><em>Markdown</em></span>\nappeared.</p>'
    },
    {
      'resourcePath': Path.join('filter', 'nested-filter.pug'),
      'matchFn': '<script>//<![CDATA[\n\'use strict\';\n\nvar myFunc = function myFunc() {\n  return \'This is ES2015 in a CD\' + \'ATA\';\n};\n//]]></script>'
    },
  ])

})
