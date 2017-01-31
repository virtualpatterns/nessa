import It from './library/it'
import Path from '../library/path'

describe('Inheritance', () => {

  It.shouldEqual([
    {
      'path': Path.join('inheritance', 'default.pug'),
      'matchFn': '<div class="article"><div class="subject">Subject</div><div class="content"><div class="sub-article"><div class="sub-subject">Sub-Subject</div><div class="sub-content">You rock!</div></div></div></div>'
    },
    {
      'path': Path.join('inheritance', 'default-content.pug'),
      'matchFn': '<div>Default Sub-Content</div>'
    },
    {
      'path': Path.join('inheritance', 'block-append.pug'),
      'matchFn': '<ul><li>0</li><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>'
    },
    {
      'path': Path.join('inheritance', 'block-prepend.pug'),
      'matchFn': '<ul><li>-2</li><li>-1</li><li>0</li><li>1</li><li>2</li></ul>'
    },
  ])

})

// (function() {
//   var nessaUtilities = require('/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/library/utilities');
//
//   return (function() {
//     var nessaNodes = [];
//     nessaNodes = nessaNodes.concat(
//       (function() {
//         var nessaNodes = [];
//         nessaNodes = nessaNodes.concat(
//           (function() {
//             var nessaNodes = [];
//             function nessaNamedBlock_content() {
//               var nessaNodes = [];
//               (function() {
//                 var nessaChildren = [];
//                 nessaChildren = nessaChildren.concat(
//                   (function() {
//                     var nessaNodes = [];
//                     nessaNodes.push('Default Content');
//                     return nessaNodes;
//                   })()
//                 );
//                 nessaNodes.push(nessaUtilities.create('div', {}, nessaChildren));
//               })();
//               return nessaNodes;
//             }
//             return nessaNodes;
//           })()
//         );
//         function nessaNamedBlock_content() {
//           var nessaNodes = [];
//           (function() {
//             var nessaChildren = [];
//             nessaChildren = nessaChildren.concat(
//               (function() {
//                 var nessaNodes = [];
//                 nessaNodes.push('Content');
//                 return nessaNodes;
//               })()
//             );
//             nessaNodes.push(nessaUtilities.create('div', {}, nessaChildren));
//           })();
//           return nessaNodes;
//         }
//         return nessaNodes;
//       })()
//     );
//     return nessaNodes[0];
//   })();
// })();
//
// { type: 'Block',
//   nodes:
//    [ { type: 'Extends',
//        file:
//         { type: 'FileReference',
//           path: './default-content-inherited.pug',
//           line: 1,
//           filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content.pug',
//           fullPath: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content-inherited.pug',
//           str: 'block content\n  div Default Content\n',
//           ast:
//            { type: 'Block',
//              nodes:
//               [ { type: 'NamedBlock',
//                   nodes:
//                    [ { type: 'Tag',
//                        name: 'div',
//                        selfClosing: false,
//                        block:
//                         { type: 'Block',
//                           nodes:
//                            [ { type: 'Text',
//                                val: 'Default Content',
//                                line: 2,
//                                filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content-inherited.pug' },
//                              [length]: 1 ],
//                           line: 2,
//                           filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content-inherited.pug' },
//                        attrs: [ [length]: 0 ],
//                        attributeBlocks: [ [length]: 0 ],
//                        isInline: false,
//                        line: 2,
//                        filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content-inherited.pug' },
//                      [length]: 1 ],
//                   line: 1,
//                   filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content-inherited.pug',
//                   name: 'content',
//                   mode: 'replace' },
//                 [length]: 1 ],
//              line: 0,
//              filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content-inherited.pug' } },
//        line: 1,
//        filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content.pug' },
//      { type: 'NamedBlock',
//        nodes:
//         [ { type: 'Tag',
//             name: 'div',
//             selfClosing: false,
//             block:
//              { type: 'Block',
//                nodes:
//                 [ { type: 'Text',
//                     val: 'Content',
//                     line: 3,
//                     filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content.pug' },
//                   [length]: 1 ],
//                line: 3,
//                filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content.pug' },
//             attrs: [ [length]: 0 ],
//             attributeBlocks: [ [length]: 0 ],
//             isInline: false,
//             line: 3,
//             filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content.pug' },
//           [length]: 1 ],
//        line: 2,
//        filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content.pug',
//        name: 'content',
//        mode: 'replace' },
//      [length]: 2 ],
//   line: 0,
//   filename: '/Users/fficnar/Projects/Shared Projects/JavaScript/nessa/tests/resources/inheritance/default-content.pug' }
//
