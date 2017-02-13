import Assert from 'assert'
import { Path } from 'mablung'

import It from './library/it'

describe('Attribute', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('attribute', 'default.pug'),
      'matchFn': '<a href="google.com">Google</a>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('attribute', 'default-class.pug'),
      'matchFn': '<a class="button" href="google.com">Google</a>'
    },
    {
      'resourcePath': Path.join('attribute', 'default-class-comma.pug'),
      'matchFn': '<a class="button" href="google.com">Google</a>'
    },
    {
      'resourcePath': Path.join('attribute', 'default-expression.pug'),
      'matchFn': '<body class="authed"></body>'
    },
    {
      'resourcePath': Path.join('attribute', 'multiline-attribute.pug'),
      'matchFn': '<input type="checkbox" name="agreement" checked>'
    },
    {
      'resourcePath': Path.join('attribute', 'long-multiline-attribute.pug'),
      'matchFn': (virtualContent, realContent) => {

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
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('attribute', 'non-quoted-attribute.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent.properties['(click)'], 'play()')
        Assert.equal(realContent, '<div class="div-class"></div>')
      }
    },
    {
      'resourcePath': Path.join('attribute', 'quoted-attribute.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent.properties['(click)'], 'play()')
        Assert.equal(realContent, '<div class="div-class"></div>')
      }
    },
    {
      'resourcePath': Path.join('attribute', 'attribute-interpolation-additive.pug'),
      'matchFn': '<a href="/pug-test.html">Link</a>'
    },
    {
      'resourcePath': Path.join('attribute', 'attribute-interpolation.pug'),
      'matchFn': '<a href="https://example.com/">Another link</a>'
    },
    {
      'resourcePath': Path.join('attribute', 'attribute-interpolation-template-additive.pug'),
      'matchFn': '<button type="button" class="btn btn-info btn-lg"></button>'
    },
    {
      'resourcePath': Path.join('attribute', 'attribute-interpolation-template.pug'),
      'matchFn': '<button type="button" class="btn btn-info btn-lg"></button>'
    },
    {
      'resourcePath': Path.join('attribute', 'boolean-attribute.pug'),
      'matchFn': '<input type="checkbox" checked>'
    },
    {
      'resourcePath': Path.join('attribute', 'boolean-attribute-false.pug'),
      'matchFn': '<input type="checkbox">'
    },
    {
      'resourcePath': Path.join('attribute', 'boolean-attribute-true.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent.properties.checked, 'checked')
      }
    },
    {
      'resourcePath': Path.join('attribute', 'boolean-attribute-true-string.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent.properties.checked, 'true')
      }
    },
    {
      'resourcePath': Path.join('attribute', 'boolean-attribute-false-string.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent.properties.checked, 'false')
      }
    },
    {
      'resourcePath': Path.join('attribute', 'style-attribute.pug'),
      'matchFn': '<a style="color:red;background:green"></a>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('attribute', 'class-attribute-array.pug'),
      'matchFn': '<a class="foo bar baz"></a>'
    },
    {
      'resourcePath': Path.join('attribute', 'class-attribute-array-combined.pug'),
      'matchFn': '<a class="bang foo bar baz bing"></a>'
    },
    {
      'resourcePath': Path.join('attribute', 'class-attribute-object-not-current.pug'),
      'matchFn': '<a href="/">Home</a>'
    },
    {
      'resourcePath': Path.join('attribute', 'class-attribute-object-current.pug'),
      'matchFn': '<a class="active" href="/about">About</a>'
    },
    {
      'resourcePath': Path.join('attribute', 'class-literal-classname.pug'),
      'matchFn': '<a class="button"></a>'
    },
    {
      'resourcePath': Path.join('attribute', 'class-literal-div.pug'),
      'matchFn': '<div class="content"></div>'
    },
    {
      'resourcePath': Path.join('attribute', 'id-literal-idname.pug'),
      'matchFn': '<a id="main-link"></a>'
    },
    {
      'resourcePath': Path.join('attribute', 'id-literal-div.pug'),
      'matchFn': '<div id="content"></div>'
    },
    {
      'resourcePath': Path.join('attribute', 'and-attribute.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent.properties.id, 'foo')
        Assert.equal(virtualContent.properties['data-bar'], 'foo')
        Assert.equal(virtualContent.properties['data-foo'], 'bar')
      }
    },
    {
      'resourcePath': Path.join('attribute', 'and-attribute-variables.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent.properties.id, 'foo')
        Assert.equal(virtualContent.properties.className, 'baz')
        Assert.equal(virtualContent.properties['data-bar'], 'foo')
      },
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('attribute', 'escaped-attribute.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent.properties.data, '&lt;code&gt;')
      },
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('attribute', 'unescaped-attribute.pug'),
      'matchFn': (virtualContent, realContent) => {
        Assert.equal(virtualContent.properties.data, '<code>')
      }
    },
  ])

})
