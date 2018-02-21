import { Path } from '@virtualpatterns/mablung'

import It from '../it'

describe('(when using inheritance)', () => {

  It.shouldEqual([
    {
      'templatePath': Path.join(__dirname, 'default.pug'),
      'match': '<div class="article"><div class="subject">Subject</div><div class="content"><div class="sub-article"><div class="sub-subject">Sub-Subject</div><div class="sub-content">You rock!</div></div></div></div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'default-content.pug'),
      'match': '<div>Default Sub-Content</div>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'block-append.pug'),
      'match': '<ul><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>',
      'it': it
    },
    {
      'templatePath': Path.join(__dirname, 'block-prepend.pug'),
      'match': '<ul><li>-2</li><li>-1</li><li>0</li><li>1</li><li>2</li></ul>',
      'it': it
    }
  ])

})
