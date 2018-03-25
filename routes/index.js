var express = require('express');
var app = express();

app.get("/", function(req, res){
	var message = '';
  	res.render('index',{message: message});
 
})

module.exports = app;