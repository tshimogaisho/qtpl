
exports.index = function(req, res){
  res.render('index', { title: 'Qtpl' })
};

exports.user = require("./user").user;
exports.testtpls = require("./testtpls").testtpls;