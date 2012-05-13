var async = require('async');

exports.tree = function(mongoClient){
	return function(req, res){
		var userid = req.param("userid");
		var body = req.body;
		
		mongoClient.open(function(error, p_client){
			
	    	p_client.collection("user", function(error, collection) {
				collection.findOne({"userid": userid}, {}, function(err, result){
					if(!result){
						res.send(404);
						p_client.close();
						return;
					}
			    	p_client.collection("tree", function(error, collection) {
						collection.update({"userid": userid},  {$set: {"tree": body}}, function(err, result){
							p_client.close();
						});
			    	});
				});
	    	});

		});		
	};
};
