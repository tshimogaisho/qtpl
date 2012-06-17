var mongodb = require('mongodb');

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var mongoclient;

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.favicon(__dirname + '/public/ico/favicon.ico', {
	    maxAge: 2592000000
	  }));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongoclient = new mongodb.Db('qtpl', 
		  new mongodb.Server("127.0.0.1", 27017, {}), {});
});

mongoclient.open(function( err, client){
	if(err){
		console.log(err);
	}else{
		console.log("connected to mongodb");
	}
});

app.configure('production', function(){
  app.use(express.errorHandler());
//  mongoclient = new mongodb.Server("localhost", 27017, {});
});

app.get('/', routes.index);
app.get('/:userid', routes.user(mongoclient));
app.get('/:userid/tree', routes.tree("get", mongoclient));
app.put('/:userid/tree', routes.tree("put", mongoclient));
app.get('/:userid/tpl/:nid', routes.tpl("get", mongoclient));
app.put('/:userid/tpl/:nid', routes.tpl("put", mongoclient));
app.delete('/:userid/tpl/:nid', routes.tpl("delete", mongoclient));

//app.get('/:userid/tpl/:nid/paramset/', routes.tplparamset("get", mongoclient));
app.post('/:userid/tpl/:nid/paramset', routes.tplparamset("post", mongoclient));

app.get('/:userid/testtpls', routes.testtpls);


var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
