const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')

const server = express()
server.all('*', function logAllRequests (req, res, next) {
  console.log('Request at static server for %s://%s%s', req.protocol, req.get('host'), req.originalUrl)
  next()
})

var staticRoot = path.resolve(__dirname, 'dist/')
console.log('Serving statics at %s', staticRoot)
server.use('/', express.static(staticRoot))
server.use(favicon(path.resolve(staticRoot, 'imgs/icon.png')))
var listener = server.listen(process.env.PORT || 8080, function () {
  console.log('Statics server running at %j for %s', listener.address(), staticRoot)
})

process.on('SIGINT', function () {
  console.log('Turning off')
  server.close()
  process.exit()
})

process.on('exit', () => console.log('DONE'))
