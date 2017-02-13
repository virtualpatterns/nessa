import { Path } from 'mablung'

import It from './library/it'

describe('Interpolation', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('interpolation', 'escaped-string-interpolation.pug'),
      'matchFn': '<div><h1>On Dogs: Man&#39;s Best Friend</h1><p>Written with love by enlore</p><p>This will be safe: &lt;span&gt;escape!&lt;/span&gt;</p></div>'
    },
    {
      'resourcePath': Path.join('interpolation', 'escaped-string-interpolation-expression.pug'),
      'matchFn': '<p>This is NOT MY INSIDE VOICE</p>'
    },
    {
      'resourcePath': Path.join('interpolation', 'escaped-string-interpolation-curly-brace.pug'),
      'matchFn': '<p>No escaping for }!</p>'
    },
    {
      'resourcePath': Path.join('interpolation', 'escaped-string-interpolation-meta.pug'),
      'matchFn': '<div><p>Escaping works with #{interpolation}</p><p>Interpolation works with #{interpolation} too!</p></div>',
    },
    {
      'resourcePath': Path.join('interpolation', 'tag-interpolation.pug'),
      'matchFn': '<p>This is a very long and boring paragraph that spans multiple lines.\nSuddenly there is a <strong>strongly worded phrase</strong> that cannot be\n<em>ignored</em>.</p>'
    },
    {
      'resourcePath': Path.join('interpolation', 'whitespace-control.pug'),
      'matchFn': '<div><p>If I don&#39;t write the paragraph with tag interpolation, tags like<strong>strong</strong>and<em>em</em>might produce unexpected results.</p><p>If I do, whitespace is <strong>respected</strong> and <em>everybody</em> is happy.</p></div>'
    }
  ])

  It.shouldBeUnSupported([
    {
      'resourcePath': Path.join('interpolation', 'unescaped-string-interpolation.pug')
    }
  ])

})
