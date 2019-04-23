(function() {
  var fs = require('fs');
  var express = require('express');
  var http = require('http');
  var bodyParser = require('body-parser');
  var app = express();

app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.json());

http.createServer(app).listen(app.get('port'), function(){
console.log("Express server listening on port " + app.get('port'));
  });       

}).call(this);
