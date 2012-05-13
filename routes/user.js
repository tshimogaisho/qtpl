exports.user = function(req, res){
	console.log(req.param("userid"));
	//TODO
	
	
	res.render('user', { title: 'Qtpl', resourcename: "user" });
};
