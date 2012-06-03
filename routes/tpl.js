var async = require('async');
var _ = require('underscore')._;

exports.tpl = function(method, mongoclient){
	
	if( method === "put"){
		return function(req, res){
			var nid = req.param("nid");
			var userid = req.param("userid");
			var body = req.body;
			
			mongoclient.collection("tpl", function(error, collection) {
				collection.findOne({ "userid": userid, "nid": nid }, {}, function(err, result){
					if(result){
						collection.update({ "userid": userid, "nid": nid },  
								{ $set: {"tpldata": body}, $inc : {"updateCnt" : 1 } }, function(err){
							if(err){
								console.log(err);
								res.send(500);
								return;
							}
							console.log("tpl data updated. nid: %s data: %s", nid, JSON.stringify(body));
							res.send(200);
						});
					}else{
						collection.save(_.extend({"userid": userid, "nid": nid}, body) , function(err){
							if(err){
								console.log(err);
								res.send(500);
								return;
							}
							console.log("tpl data created. nid: %s data: %s", nid, JSON.stringify(body));
							res.send(200);							
						});
					}
				});

	    	});

		};
	}
	
	if( method === "delete"){
		return function(req, res){
			var nid = req.param("nid");
			var userid = req.param("userid");
			console.log("nid:", nid);
			mongoclient.collection("tpl", function(error, collection) {
				collection.remove({"userid": userid, "nid": nid}, function(err, result){
					if(err){
						console.error(err); return;
					}
					console.log("document is removed. userid:%s nid:%s", userid, nid);
					res.send(200);
				});
			});

		}
	}

};
