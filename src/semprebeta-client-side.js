const mocha = require('mocha')

if (process.env.NODE_ENV === 'production') {
  console.log('GA')
  const gaHref = 'https://www.google-analytics.com/analytics.js'
  window.ga = window.ga || function(){ (ga.q = ga.q || []).push(arguments) }
  window.ga.l = new Date().getTime()
  const insert = document.createElement('script')
  insert.async = 1
  insert.src = gaHref

  const firstScript = document.getElementsByTagName('script')[0]
  firstScript.parentNode.insertBefore(insert, firstScript)

  window.ga('create', process.env.GOOGLE_ANALYTICS_ID, 'auto')
  window.ga('send', 'pageview')
  console.log('GA-END')
} else if (process.env.NODE_ENV === 'test') {
  console.log('MO')
  require('./semprebeta-client-side.test')
  mocha.run()
  console.log('MO-END')
}
