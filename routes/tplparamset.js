var async = require('async');
var mongodb = require('mongodb');
var _ = require('underscore')._;

exports.tplparamset = function(method, mongoclient){
		
	if( method === "post" ){
		return function(req, res){
			var nid = req.param("nid");
			var userid = req.param("userid");
			var body = req.body;
			
			//番号採番
			var collection = new mongodb.Collection(mongoclient, 'tpl');
			collection.findAndModify(
				{ "userid": userid, "nid": nid },
				[],	//sort
				{ $inc: { paramsetSeq: 1 } },	//update
				{ "new" : true , "fields": {paramsetSeq: 1}},	//options
				function(err, result){
					if(!result){
						res.send(404); return;
					}
					var paramsetSeq = result.paramsetSeq;
					
					console.log("push paramset. userid: %s, nid: %s, paramsetSeq: %d, ", userid, nid, paramsetSeq, body);
					
					collection.update(
						{ "userid": userid, "nid": nid }, 
						{
							$push: {
								paramset:{
										id: paramsetSeq,
										name: body.name,
										vals: body.vals
									}
							},
							$inc : {"updateCnt" : 1 }
						}
					);
					
					res.json({paramsetid: paramsetSeq});
				}
			);
		}
	}

};
