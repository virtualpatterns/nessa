import CreateContent from 'virtual-dom/create-element'

import Index from './index.pug'
import Welcome from './welcome.pug'

document.addEventListener('DOMContentLoaded', () => {

  let virtualContent = Index({
    Welcome,
    'name': 'virtualpatterns.com'
  })
  let realContent = CreateContent(virtualContent)

  document.getElementById('content').appendChild(realContent)

})
