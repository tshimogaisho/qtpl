
exports.index = function(req, res){
  res.render('index', { title: 'Qtpl' })
};

exports.user = require("./user").user;
exports.tree = require("./tree").tree;
exports.tpl = require("./tpl").tpl;
exports.tplparamset = require("./tplparamset").tplparamset;

exports.testtpls = require("./testtpls").testtpls;
