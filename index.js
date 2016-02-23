var express = require('express')
var server = express()
var path = require('path')

server.all('*', function logAllRequests (req, res, next) {
  console.log('Request at static server for %s://%s%s', req.protocol, req.get('host'), req.originalUrl)
  next()
})

var staticRoot = path.resolve(__dirname, 'dist/')
console.log('Serving statics at %s', staticRoot)
server.use('/', express.static(staticRoot))
var listener = server.listen(8080, function () {
  console.log('Statics server running at %j for %s', listener.address(), staticRoot)
})
