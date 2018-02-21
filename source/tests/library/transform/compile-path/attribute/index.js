// import Assert from 'assert'
import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using attributes)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'match': '<a href="google.com">Google</a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'default-class.pug'),
      'match': '<a class="button" href="google.com">Google</a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'default-class-comma.pug'),
      'match': '<a class="button" href="google.com">Google</a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'default-expression.pug'),
      'match': '<body class="authed"></body>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'multiline-attribute.pug'),
      'match': '<input type="checkbox" name="agreement" checked>',
      'it': it
    },
    // {
    //   'templatePath': Path.join(__dirname, 'long-multiline-attribute.pug'),
    //   'match': (virtualContent) => {
    //     Assert.equal(virtualContent.properties['data-json'], '\n  {\n    &quot;very-long&quot;: &quot;piece of &quot;,\n    &quot;data&quot;: true\n  }\n')
    //
    //   },
    //   'it': it.skip
    // },
    // {
    //   'templatePath': Path.join(__dirname, 'non-quoted-attribute.pug'),
    //   'match': (virtualContent, realContent) => {
    //     Assert.equal(virtualContent.properties['(click)'], 'play()')
    //     Assert.equal(realContent, '<div class="div-class"></div>')
    //   },
    //   'it': it.skip
    // },
    // {
    //   'templatePath': Path.join(__dirname, 'quoted-attribute.pug'),
    //   'match': (virtualContent, realContent) => {
    //     Assert.equal(virtualContent.properties['(click)'], 'play()')
    //     Assert.equal(realContent, '<div class="div-class"></div>')
    //   },
    //   'it': it.skip
    // },
    {
      'templatePath': Path.join(__dirname, 'attribute-interpolation-additive.pug'),
      'match': '<a href="/pug-test.html">Link</a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'attribute-interpolation.pug'),
      'match': '<a href="https://example.com/">Another link</a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'attribute-interpolation-template-additive.pug'),
      'match': '<button type="button" class="btn btn-info btn-lg"></button>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'attribute-interpolation-template.pug'),
      'match': '<button type="button" class="btn btn-info btn-lg"></button>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'boolean-attribute.pug'),
      'match': '<input type="checkbox" checked>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'boolean-attribute-false.pug'),
      'match': '<input type="checkbox">',
      'it': it
    },
    // {
    //   'templatePath': Path.join(__dirname, 'boolean-attribute-true.pug'),
    //   'match': (virtualContent) => {
    //     Assert.equal(virtualContent.properties.checked, 'checked')
    //   },
    //   'it': it.skip
    // },
    // {
    //   'templatePath': Path.join(__dirname, 'boolean-attribute-true-string.pug'),
    //   'match': (virtualContent) => {
    //     Assert.equal(virtualContent.properties.checked, 'true')
    //   },
    //   'it': it.skip
    // },
    // {
    //   'templatePath': Path.join(__dirname, 'boolean-attribute-false-string.pug'),
    //   'match': (virtualContent) => {
    //     Assert.equal(virtualContent.properties.checked, 'false')
    //   },
    //   'it': it.skip
    // },
    // {
    //   'templatePath': Path.join(__dirname, 'style-attribute.pug'),
    //   'match': '<a style="color:red;background:green"></a>',
    //   'it': it.skip
    // },
    {
      'templatePath': Path.join(__dirname, 'class-attribute-array.pug'),
      'match': '<a class="foo bar baz"></a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'class-attribute-array-combined.pug'),
      'match': '<a class="bang foo bar baz bing"></a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'class-attribute-object-not-current.pug'),
      'match': '<a href="/">Home</a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'class-attribute-object-current.pug'),
      'match': '<a class="active" href="/about">About</a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'class-literal-classname.pug'),
      'match': '<a class="button"></a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'class-literal-div.pug'),
      'match': '<div class="content"></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'id-literal-idname.pug'),
      'match': '<a id="main-link"></a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'id-literal-div.pug'),
      'match': '<div id="content"></div>',
      'it': it
    } //,
    // {
    //   'templatePath': Path.join(__dirname, 'and-attribute.pug'),
    //   'match': (virtualContent) => {
    //     Assert.equal(virtualContent.properties.id, 'foo')
    //     Assert.equal(virtualContent.properties['data-bar'], 'foo')
    //     Assert.equal(virtualContent.properties['data-foo'], 'bar')
    //   },
    //   'it': it.skip
    // },
    // {
    //   'templatePath': Path.join(__dirname, 'and-attribute-variables.pug'),
    //   'match': (virtualContent) => {
    //     Assert.equal(virtualContent.properties.id, 'foo')
    //     Assert.equal(virtualContent.properties.className, 'baz')
    //     Assert.equal(virtualContent.properties['data-bar'], 'foo')
    //   },
    //   'it': it.skip
    // },
    // {
    //   'templatePath': Path.join(__dirname, 'escaped-attribute.pug'),
    //   'match': (virtualContent) => {
    //     Assert.equal(virtualContent.properties.data, '&lt;code&gt;')
    //   },
    //   'it': it.skip
    // },
    // {
    //   'templatePath': Path.join(__dirname, 'unescaped-attribute.pug'),
    //   'match': (virtualContent) => {
    //     Assert.equal(virtualContent.properties.data, '<code>')
    //   },
    //   'it': it.skip
    // }
  ])

})
