import It from './library/it'

import WelcomeWebPack from './resources/sample/welcome.webpack.pug'
import DefaultWebPack from './resources/sample/default.webpack.pug'

const WelcomeBabel = require('./resources/sample/welcome.babel.pug')
const DefaultBabel = require('./resources/sample/default.babel.pug')

describe('Sample', () => {

  It.shouldEqual([
    {
      'resourcePath': './resources/sample/default.webpack.pug',
      'virtualContentFn': DefaultWebPack,
      'data': {
        WelcomeWebPack,
        'name': 'Forbes'
      },
      'matchFn': '<div><h1>Welcome Forbes</h1><p>Forbes\'s Pug source code!</p></div>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': './resources/sample/default.babel.pug',
      'virtualContentFn': DefaultBabel,
      'data': {
        'name': 'Forbes'
      },
      'matchFn': '<div><h1>Welcome Forbes</h1><p>Forbes\'s Pug source code!</p></div>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
  ])

})
