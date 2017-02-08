import It from './library/it'

import WelcomeBabel from './resources/sample/welcome.babel.pug'
import WelcomeWebPack from './resources/sample/welcome.webpack.pug'

describe('Sample', () => {

  It.shouldEqual([
    {
      'resourcePath': './resources/sample/default.babel.pug',
      'virtualContentFn': require('./resources/sample/default.babel.pug'),
      'data': {
        'name': 'Forbes'
      },
      'matchFn': '<div><h1>Welcome Forbes</h1><p>Forbes\'s Pug source code!</p></div>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
    {
      'resourcePath': './resources/sample/default.webpack.pug',
      'virtualContentFn': require('./resources/sample/default.webpack.pug'),
      'data': {
        WelcomeWebPack,
        'name': 'Forbes'
      },
      'matchFn': '<div><h1>Welcome Forbes</h1><p>Forbes\'s Pug source code!</p></div>',
      // 'isDebugged': true,
      // 'itFn': it.only
    },
  ])

})
