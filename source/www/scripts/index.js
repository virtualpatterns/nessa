import CreateContent from 'virtual-dom/create-element'

import IndexContentFn from './index.pug'

document.addEventListener('DOMContentLoaded', () => {

  let virtualContent = IndexContentFn()
  let realContent = CreateContent(virtualContent)

  document.getElementById('content').appendChild(realContent)

})
