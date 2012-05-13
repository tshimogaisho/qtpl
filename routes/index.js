
exports.index = function(req, res){
  res.render('index', { title: 'Qtpl' })
};

exports.user = require("./user").user;
exports.tree = require("./tree").tree;

exports.testtpls = require("./testtpls").testtpls;