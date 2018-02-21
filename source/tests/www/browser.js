import { Log } from '@virtualpatterns/mablung'
import Puppeteer from 'puppeteer'

const Page = Object.create({})

Page.onError = function (error) {
  Log.debug('Page.onError(error) { ... }')
  Log.debug(error)
}

Page.onConsole = async function (message) {

  let [ handle ] = message.args()
  let _message = await handle.jsonValue()

  // Log.debug('Page.onConsole(message) { ... }')
  Log.debug(`Page.onConsole(message) { ... }\n\n${_message}`)

}

const Browser = Object.create({})

Browser.open = async function (url, options) {

  let browser = await Puppeteer.launch(options)
  Object.setPrototypeOf(Browser, browser)

  let [ page ] = await browser.pages()
  Object.setPrototypeOf(Page, page)

  Page.on('pageerror', Page.onError)
  Page.on('console', Page.onConsole)

  await Page.goto(url, { 'waitUntil': 'domcontentloaded' })

}

Browser.close = async function () {

  Page.removeListener('console', Page.onConsole)
  Page.removeListener('pageerror', Page.onError)

  try {
    await Object.getPrototypeOf(Browser).close()
  } finally {
    Object.setPrototypeOf(Browser, {})
    Object.setPrototypeOf(Page, {})
  }

}

export { Browser, Page }
