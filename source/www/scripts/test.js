// if (window.callPhantom) {
//   window.callPhantom({
//     'message': 'onTest.js'
//   })
// }

const Mocha = mocha

document.addEventListener('DOMContentLoaded', () => {

  // if (window.callPhantom) {
  //   window.callPhantom({
  //     'message': 'onDOMContentLoaded'
  //   })
  // }

  if (window.initMochaPhantomJS) {
    window.initMochaPhantomJS()
  }

  Mocha.setup({
    'bail': true,
    'timeout': 0,
    'ui': 'bdd'
  })

  require('./tests/sample')

  Mocha.run()
    // .on('end', (...parameters) => {
    //   if (window.callPhantom) {
    //     window.callPhantom({
    //       'message': 'onMochaFinished'
    //     })
    //   }
    // });

})
