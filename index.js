var http = require('http'),
  fs = require('fs'),
  path = require('path'),
  config = require('./semprebeta-config'),
  compPool = require('comp-pool').startup(config.compPoolPort),
  express = require('express'),
  server = express();

server.all("*", function logAllRequests(req, res, next) {
  console.log("Request at static server for %s://%s%s", req.protocol, req.get('host'), req.originalUrl);
  next();
});

var staticRoot = __dirname + '/dist/';
console.log("Serving statics at %s", staticRoot);
server.use("/", express.static(staticRoot));
var listener = server.listen(8080, function() {
  console.log('Statics server running at %j', listener.address());
});

