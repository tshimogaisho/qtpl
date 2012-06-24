var async = require('async');
var mongodb = require('mongodb');
var _ = require('underscore')._;


exports.tplparamset = function(method, mongoclient){
	
	if( method === "delete" ){
		return function(req, res){
			var nid = req.param("nid");
			var userid = req.param("userid");
			var paramsetid = req.param("paramsetid");
			
			
			var collection = new mongodb.Collection(mongoclient, 'tpl');
			collection.update(
					{ "userid": userid, "nid": nid },
					{
						$pull : { paramset: { "id" : Math.floor(paramsetid) } },
						$inc : { "updateCnt" : 1 }
					},
					{ safe: true },
					function(err, result){
						if(err){
							console.log(err); return;
						}
						console.log("paramset is removed. nid:%s userid:%s paramsetid:%d ", nid, userid, paramsetid);
						res.send(200);
					}
				);
		};
	}
	
	if( method === "put" ){
		return function(req, res){
			var nid = req.param("nid");
			var userid = req.param("userid");
			var paramsetid = req.param("paramsetid");
			var paramset = req.body;
			
			console.log(paramset);
			
			var collection = new mongodb.Collection(mongoclient, 'tpl');
			collection.update(
					{ "userid": userid, "nid": nid, "paramset.id" : Math.floor(paramsetid) },
					{
						$set : { "paramset.$": paramset },
						$inc : { "updateCnt" : 1 }
					},
					{ safe: true },
					function(err, result){
						if(err){
							console.log(err); return;
						}
						console.log("paramset is updated. nid:%s userid:%s paramsetid:%d ", nid, userid, paramsetid);
						res.send(200);
					}
				);
		};
	}
	
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
							$inc : { "updateCnt" : 1 }
						},
						{ safe: true },
						function(err, result){
							if(err){
								console.log(err); return;
							}
							res.json({paramsetid: paramsetSeq});
						}
					);
					
					
				}
			);
		}
	}

};


exports.tplparamset.rename = function(method, mongoclient){

	if( method === "post" ){

		return function(req, res){

			var nid = req.param("nid");
			var userid = req.param("userid");
			var paramsetid = req.param("paramsetid");
			var paramsetName = req.body.paramsetName;
			
			console.log("nid:", nid, "userid:", userid);
			console.log("paramsetid:", paramsetid, "paramsetName:", paramsetName);
			
			var collection = new mongodb.Collection(mongoclient, 'tpl');
			collection.update(
					{ "userid": userid, "nid": nid, "paramset.id" : Math.floor(paramsetid) },
					{
						"$set" : {"paramset.$.name" : paramsetName },
						"$inc" : {"updateCnt" : 1 }
					},
					{ safe: true },
					function(err, result){
						if(err){
							console.log(err); return;
						}
						console.log("paramset name is updated. ", paramsetName);
						res.send(200);
					}
				);
		}
	}
	
};




