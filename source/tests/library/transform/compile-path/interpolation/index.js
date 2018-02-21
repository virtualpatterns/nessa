import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using interpolation)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'escaped-string-interpolation.pug'),
      'match': '<div><h1>On Dogs: Man&#39;s Best Friend</h1><p>Written with love by enlore</p><p>This will be safe: &lt;span&gt;escape!&lt;/span&gt;</p></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'escaped-string-interpolation-expression.pug'),
      'match': '<p>This is NOT MY INSIDE VOICE</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'escaped-string-interpolation-curly-brace.pug'),
      'match': '<p>No escaping for }!</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'escaped-string-interpolation-meta.pug'),
      'match': '<div><p>Escaping works with #{interpolation}</p><p>Interpolation works with #{interpolation} too!</p></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'tag-interpolation.pug'),
      'match': '<p>This is a very long and boring paragraph that spans multiple lines.\nSuddenly there is a <strong>strongly worded phrase</strong> that cannot be\n<em>ignored</em>.</p>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'whitespace-control.pug'),
      'match': '<div><p>If I don&#39;t write the paragraph with tag interpolation, tags like<strong>strong</strong>and<em>em</em>might produce unexpected results.</p><p>If I do, whitespace is <strong>respected</strong> and <em>everybody</em> is happy.</p></div>',
      'it': it
    }
  ])

  It.shouldBeUnSupported([
    {
      'templatePath': Path.join(__dirname, 'unescaped-string-interpolation.pug'),
      'it': it
    }
  ])

})
