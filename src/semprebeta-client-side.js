const mocha = require('mocha')

const environment = process.env.NODE_ENV

if (environment === 'production') {
  window.ga = window.ga || function () { (window.ga.q = window.ga.q || []).push(arguments) }
  window.ga.l = new Date().getTime()
  window.ga('create', 'UA-78502217-1', 'auto')
  window.ga('send', 'pageview')
} else if (environment === 'test') {
  require('./semprebeta-client-side.test')
  mocha.run()
}
