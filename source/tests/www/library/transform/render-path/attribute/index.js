import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using attributes)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'long-multiline-attribute.pug'),
      'match': (element) => {
        // window.Log.debug({ 'data-json': element['data-json'] })
        window.Assert.equal(element['data-json'], '\n  {\n    &quot;very-long&quot;: &quot;piece of &quot;,\n    &quot;data&quot;: true\n  }\n')
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'non-quoted-attribute.pug'),
      'match': '<div class="div-class"></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'non-quoted-attribute.pug'),
      'match': (element) => {
        // window.Log.debug({ '(click)': element['(click)'] })
        window.Assert.equal(element['(click)'], 'play()')
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'quoted-attribute.pug'),
      'match': '<div class="div-class"></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'quoted-attribute.pug'),
      'match': (element) => {
        // window.Log.debug({ '(click)': element['(click)'] })
        window.Assert.equal(element['(click)'], 'play()')
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'boolean-attribute-true.pug'),
      'match': (element) => {
        // window.Log.debug({ 'checked': element.checked })
        window.Assert.equal(element.checked, true)
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'boolean-attribute-true-string.pug'),
      'match': (element) => {
        // window.Log.debug({ 'checked': element.checked })
        window.Assert.equal(element.checked, true)
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'boolean-attribute-false-string.pug'),
      'match': (element) => {
        // window.Log.debug({ 'checked': element.checked })
        window.Assert.equal(element.checked, true)
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'style-attribute.pug'),
      'match': '<a style="color: red; background: green;"></a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'and-attribute.pug'),
      'match': '<div id="foo"></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'and-attribute.pug'),
      'match': (element) => {
        // window.Log.debug({ 'data-foo': element.['data-foo'] })
        window.Assert.equal(element['data-bar'], 'foo')
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'and-attribute.pug'),
      'match': (element) => {
        // window.Log.debug({ 'data-foo': element.['data-foo'] })
        window.Assert.equal(element['data-foo'], 'bar')
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'and-attribute-variables.pug'),
      'match': '<div id="foo" class="baz"></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'and-attribute-variables.pug'),
      'match': (element) => {
        // window.Log.debug({ 'data-bar': element['data-bar'] })
        window.Assert.equal(element['data-bar'], 'foo')
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'escaped-attribute.pug'),
      'match': (element) => {
        // window.Log.debug({ 'data': element.data })
        window.Assert.equal(element.data, '&lt;code&gt;')
      },
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'unescaped-attribute.pug'),
      'match': (element) => {
        // window.Log.debug({ 'data': element.data })
        window.Assert.equal(element.data, '<code>')
      },
      'it': it
    }
  ])

})
