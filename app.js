var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  fs = require('fs'),
  url = require('url'),
  pollster = require('pollster');

var port = process.env.PORT || 4000;
var app = express();
var server = app.listen(port);

console.log('Express server listening on port ' + port);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware({
    src: __dirname + '/public',
    compress: true
  }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes(app);
