var async = require('async');

exports.tree = function(method, mongoclient){
	
	if( method === "put" ){
		return function(req, res){
			var userid = req.param("userid");
			var body = req.body;
			
			mongoclient.collection("user", function(error, collection) {
				collection.findOne({"userid": userid}, {}, function(err, result){
					if(!result){
						res.send(404);
						return;
					}
					mongoclient.collection("tree", function(error, collection) {
						collection.update({"userid": userid},  {$set: {"tree": body}}, function(err, result){
							console.log("treeupdated. userid: %s", userid);
							res.send(200);
						});
			    	});
				});
	    	});

		};
	}
	
	if( method === "get" ){
		return function(req, res){
			var userid = req.param("userid");
			mongoclient.collection("tree", function(error, collection) {
				collection.findOne({"userid": userid}, {}, function(err, result){
					if(!result){
						res.send(404);
						return;
					}
					res.json(result.tree);
				});
	    	});
		};
	}
	
	

};
