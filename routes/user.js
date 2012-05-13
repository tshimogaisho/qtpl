exports.user = function(mongoClient){
	return function(req, res){
		var userid = req.param("userid");
		console.log("userid: ", userid);
		mongoClient.open(function(error, p_client){
			p_client.collection("user", function(error, collection) {
				var r = collection.findOne({"userid": userid}, {}, function(err, result){
					if(!result){
						res.send('Sorry, cant find that', 404);
						p_client.close();
						return;
					}
					p_client.close();
					res.render('user', { title: 'Qtpl', resourcename: "user" });					
				});
			});
		});		
	};
};
