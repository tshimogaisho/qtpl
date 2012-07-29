//var mongodb = require('mongodb');
var mongodb = require('mongoskin');
var url = require('url');
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

var mongoclient;




app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));  
	app.use(express.errorHandler());
	mongoclient = new mongodb.Db('qtpl', 
			  new mongodb.Server("127.0.0.1", 27017, {}), {});
});

app.configure('production', function(){
	app.use(express.errorHandler());


	mongoclient = mongodb.db("mongodb://heroku:herokumongo@flame.mongohq.com:27031/app4012201", function(err){
		if(err){
			console.log(err);
		}
	});	
});

app.configure(function(){
	if (process.env.BASIC_AUTH_USER) {
		app.use(express.basicAuth(process.env.BASIC_AUTH_USER, process.env.BASIC_AUTH_PASS));
	}
	
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

mongoclient.open(function( err, client){
	if(err){
		console.log(err);
	}else{
		console.log("connected to mongodb");
		app.get('/', routes.index);
		app.get('/:userid', routes.user(client));
		app.get('/:userid/tree', routes.tree("get", client));
		app.put('/:userid/tree', routes.tree("put", client));
		app.post('/:userid/tpl', routes.tpl("post", client));
		app.get('/:userid/tpl/:nid', routes.tpl("get", client));
		app.put('/:userid/tpl/:nid', routes.tpl("put", client));
		app.delete('/:userid/tpl/:nid', routes.tpl("delete", client));

		//app.get('/:userid/tpl/:nid/paramset/', routes.tplparamset("get", client));
		app.post('/:userid/tpl/:nid/paramset', routes.tplparamset("post", client));
		app.put('/:userid/tpl/:nid/paramset/:paramsetid', routes.tplparamset("put", client));
		app.delete('/:userid/tpl/:nid/paramset/:paramsetid', routes.tplparamset("delete", client));

		app.post('/:userid/tpl/:nid/paramset/:paramsetid/rename', routes.tplparamset.rename("post", client));

		app.get('/:userid/testtpls', routes.testtpls);
		
		var port = process.env.PORT || 3000;
		app.listen(port);
		console.log("Express server listening on port %d in %s mode", port, app.settings.env);		
	}
	
});		
