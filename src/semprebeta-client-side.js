const mocha = require('mocha')

if (process.env.NODE_ENV === 'production') {
  console.log('GA')
  window.ga = window.ga || function () { (window.ga.q = window.ga.q || []).push(arguments) }
  window.ga.l = new Date().getTime()
  window.ga('create', process.env.GOOGLE_ANALYTICS_ID, 'auto')
  window.ga('send', 'pageview')
} else if (process.env.NODE_ENV === 'test') {
  console.log('MO')
  require('./semprebeta-client-side.test')
  mocha.run()
}
