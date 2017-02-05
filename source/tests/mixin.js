import It from './library/it'
import Path from '../library/path'

describe('Mixin', () => {

  It.shouldEqual([
    {
      'resourcePath': Path.join('mixin', 'default.pug'),
      'matchFn': '<div><ul><li>foo</li><li>bar</li><li>baz</li></ul><ul><li>foo</li><li>bar</li><li>baz</li></ul></div>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('mixin', 'default-arguments.pug'),
      'matchFn': '<ul><li class="pet">cat</li><li class="pet">dog</li><li class="pet">pig</li></ul>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('mixin', 'mixin-block.pug'),
      'matchFn': '<div><p>Nothing</p><p>Article</p></div>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('mixin', 'mixin-attributes.pug'),
      'matchFn': '<a class="btn" href="/foo">foo</a>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': Path.join('mixin', 'mixin-attributes-and.pug'),
      'matchFn': '<a href="/foo" class="btn">foo</a>'
    },
    {
      'resourcePath': Path.join('mixin', 'rest-arguments.pug'),
      'matchFn': '<ul id="my-list"><li>1</li><li>2</li><li>3</li><li>4</li></ul>'
    },
  ])

})
