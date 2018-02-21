import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using a mixin)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'match': '<div><ul><li>foo</li><li>bar</li><li>baz</li></ul><ul><li>foo</li><li>bar</li><li>baz</li></ul></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'default-arguments.pug'),
      'match': '<ul><li class="pet">cat</li><li class="pet">dog</li><li class="pet">pig</li></ul>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'mixin-block.pug'),
      'match': '<div><p>Nothing</p><p>Article</p></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'mixin-attributes.pug'),
      'match': '<a class="btn" href="/foo">foo</a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'mixin-attributes-and.pug'),
      'match': '<a href="/foo" class="btn">foo</a>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'rest-arguments.pug'),
      'match': '<ul id="my-list"><li>1</li><li>2</li><li>3</li><li>4</li></ul>',
      'it': it
    }
  ])

})
