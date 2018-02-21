import Configuration from '../../configuration'
import { Browser, Page } from './browser'

describe('www', () => {

  before(async () => {
    await Browser.open(Configuration.tests.serverUrl)
  })

  describe('index.html', () => {

    it('should take a screenshot', async () => {
      await Page.screenshot({ path: Configuration.tests.screenshotPath })
    })

  })

  require('./library/index')

  after(async () => {
    await Browser.close()
  })

})
