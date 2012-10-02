var pollster = require('pollster');
var madison = require('madison');
var title = "2012 PollWatcher";
var helpers = require('./helpers/routes_helpers');

module.exports = function(app) {
  app.get('/', function(req, res){
    console.log(__dirname)
    res.render('index', {
      title: title,
      states: helpers.inThreeChunks(madison.states)
    });
  });

  app.post('/', function(req, res){
    console.log(__dirname)
    res.redirect('/state/' + helpers.getStatePath(req.param('state')));
  });

  app.get('/state', function(req, res){
    console.log(__dirname);
    res.redirect('/');
  });

  app.get('/state/:name', function(req, res){
    console.log(__dirname);
    helpers.getPollData({state: req.param('name')}, function (data) {
      res.render('state', {
        title: title,
        polls: data,
        state: typeof madison.getStateName(req.param('name')) !== 'undefined' ?  madison.getStateName(req.param('name')) : 'invalid state' 
      });
    });
  });
  
  app.post('/state/:name', function(req, res){
    console.log(__dirname)
    res.redirect('/state/' + helpers.getStatePath(req.param('state')));
  });
};
