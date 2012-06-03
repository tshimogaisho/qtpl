exports.user = function(mongoclient){
	return function(req, res){
		var userid = req.param("userid");
		mongoclient.collection("user", function(error, collection) {
			collection.findOne({"userid": userid}, {}, function(err, result){
				if(err) console.log(err);
				if(!result){
					res.send('Sorry, cant find that', 404);
//					mongoclient.close();
					return;
				}
				res.render('user', { title: 'Qtpl', resourcename: "user", userid: userid });				
			});
		});
	};
};
