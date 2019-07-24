(function() {
  var fs = require('fs');
  var express = require('express');
  var http = require('http');
  var bodyParser =require('body-parser');
  var app = express();

  app.set('port', 8080);
  app.use(express.static(__dirname + '/app'));
  app.use(bodyParser.json());

  http.createServer(app).listen(app.get('port'), function(){});
}).call(this);
