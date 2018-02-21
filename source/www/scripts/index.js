import 'babel-polyfill'
import Assert from 'assert'
import Create from 'virtual-dom/create-element'
import { Log } from '@virtualpatterns/mablung'

import Utilities from '../../index'
// import Utilities from '../../library/utilities'

document.addEventListener('DOMContentLoaded', () => {
  Log.createFormattedLog()
  Log.debug('document.addEventListener(\'DOMContentLoaded\', () => { ... }')

  window.Assert = Assert
  window.Create = Create
  window.Log = Log
  window.Utilities = Utilities

})
