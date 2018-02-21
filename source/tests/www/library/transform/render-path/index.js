import { Log, Path } from '@virtualpatterns/mablung'

import { Page } from '../../../browser'
import Transform from '../../../../../library/transform'

describe('renderPath', () => {

  before(async () => {

    await Page.exposeFunction('renderPath', (path) => {
      Log.debug(`await Page.exposeFunction('renderPath', (${Path.trim(path)}) => { ... })`)
      return Transform.renderPath(path)
    })

  })

  require('./attribute/index')
  require('./sample/index')

})
