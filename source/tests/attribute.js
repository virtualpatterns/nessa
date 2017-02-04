import Assert from 'assert'

import It from './library/it'
import Log from '../library/log'
import Path from '../library/path'

describe('Attribute', () => {

  It.shouldEqual([
    {
      'path': Path.join('attribute', 'default.pug'),
      'matchFn': '<a href="google.com">Google</a>',
      // 'debug': true,
      // 'itFn': it.only
    },
    {
      'path': Path.join('attribute', 'default-class.pug'),
      'matchFn': '<a class="button" href="google.com">Google</a>'
    },
    {
      'path': Path.join('attribute', 'default-class-comma.pug'),
      'matchFn': '<a class="button" href="google.com">Google</a>'
    },
    {
      'path': Path.join('attribute', 'default-expression.pug'),
      'matchFn': '<body class="authed"></body>'
    },
    {
      'path': Path.join('attribute', 'multiline-attribute.pug'),
      'matchFn': '<input type="checkbox" name="agreement" checked>'
    },
    {
      'path': Path.join('attribute', 'long-multiline-attribute.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {

        // VirtualNode {
        //   tagName: 'INPUT',
        //   properties: { 'data-json': '\n  {\n    &quot;very-long&quot;: &quot;piece of &quot;,\n    &quot;data&quot;: true\n  }\n' },
        //   children: [ [length]: 0 ],
        //   key: undefined,
        //   namespace: null,
        //   count: 0,
        //   hasWidgets: false,
        //   hasThunks: false,
        //   hooks: undefined,
        //   descendantHooks: false }

        Assert.equal(virtualContent.properties['data-json'], '\n  {\n    &quot;very-long&quot;: &quot;piece of &quot;,\n    &quot;data&quot;: true\n  }\n')

      },
      // 'debug': true,
      // 'itFn': it.only
    },
    {
      'path': Path.join('attribute', 'non-quoted-attribute.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent.properties['(click)'], 'play()')
        Assert.equal(realContent, '<div class="div-class"></div>')
      }
    },
    {
      'path': Path.join('attribute', 'quoted-attribute.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent.properties['(click)'], 'play()')
        Assert.equal(realContent, '<div class="div-class"></div>')
      }
    },
    {
      'path': Path.join('attribute', 'attribute-interpolation-additive.pug'),
      'matchFn': '<a href="/pug-test.html">Link</a>'
    },
    {
      'path': Path.join('attribute', 'attribute-interpolation.pug'),
      'matchFn': '<a href="https://example.com/">Another link</a>'
    },
    {
      'path': Path.join('attribute', 'attribute-interpolation-template-additive.pug'),
      'matchFn': '<button type="button" class="btn btn-info btn-lg"></button>'
    },
    {
      'path': Path.join('attribute', 'attribute-interpolation-template.pug'),
      'matchFn': '<button type="button" class="btn btn-info btn-lg"></button>'
    },
    {
      'path': Path.join('attribute', 'boolean-attribute.pug'),
      'matchFn': '<input type="checkbox" checked>'
    },
    {
      'path': Path.join('attribute', 'boolean-attribute-false.pug'),
      'matchFn': '<input type="checkbox">'
    },
    {
      'path': Path.join('attribute', 'boolean-attribute-true.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent.properties.checked, 'checked')
      }
    },
    {
      'path': Path.join('attribute', 'boolean-attribute-true-string.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent.properties.checked, 'true')
      }
    },
    {
      'path': Path.join('attribute', 'boolean-attribute-false-string.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent.properties.checked, 'false')
      }
    },
    {
      'path': Path.join('attribute', 'style-attribute.pug'),
      'matchFn': '<a style="color:red;background:green"></a>'
    },
    {
      'path': Path.join('attribute', 'class-attribute-array.pug'),
      'matchFn': '<a class="foo bar baz"></a>'
    },
    {
      'path': Path.join('attribute', 'class-attribute-array-combined.pug'),
      'matchFn': '<a class="bang foo bar baz bing"></a>'
    },
    {
      'path': Path.join('attribute', 'class-attribute-object-not-current.pug'),
      'matchFn': '<a href="/">Home</a>'
    },
    {
      'path': Path.join('attribute', 'class-attribute-object-current.pug'),
      'matchFn': '<a class="active" href="/about">About</a>'
    },
    {
      'path': Path.join('attribute', 'class-literal-classname.pug'),
      'matchFn': '<a class="button"></a>'
    },
    {
      'path': Path.join('attribute', 'class-literal-div.pug'),
      'matchFn': '<div class="content"></div>'
    },
    {
      'path': Path.join('attribute', 'id-literal-idname.pug'),
      'matchFn': '<a id="main-link"></a>'
    },
    {
      'path': Path.join('attribute', 'id-literal-div.pug'),
      'matchFn': '<div id="content"></div>'
    },
    {
      'path': Path.join('attribute', 'and-attribute.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent.properties.id, 'foo')
        Assert.equal(virtualContent.properties['data-bar'], 'foo')
        Assert.equal(virtualContent.properties['data-foo'], 'bar')
      }
    },
    {
      'path': Path.join('attribute', 'and-attribute-variables.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent.properties.id, 'foo')
        Assert.equal(virtualContent.properties.className, 'baz')
        Assert.equal(virtualContent.properties['data-bar'], 'foo')
      },
      // 'debug': true,
      // 'itFn': it.only
    },
    {
      'path': Path.join('attribute', 'escaped-attribute.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent.properties.data, '&lt;code&gt;')
      },
      // 'debug': true,
      // 'itFn': it.only
    },
    {
      'path': Path.join('attribute', 'unescaped-attribute.pug'),
      'matchFn': (virtualContent, realContent, transformOptions) => {
        Assert.equal(virtualContent.properties.data, '<code>')
      }
    },
  ])

})
