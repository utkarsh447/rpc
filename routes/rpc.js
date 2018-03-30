var express = require('express');
var multer  =   require('multer');
var app = express();
var pdfUtil = require('pdf-to-text');
var variables = require("../variables.js")
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
  	var fn = file.originalname + '-' + Date.now()
  	var pdf_path = variables.upload_path + fn;
    callback(null, fn);
    pdfUtil.pdfToText(pdf_path, function(err, data) {
  	  if (err) throw(err);
  	  console.log(data); //Need to store it in DB    

      var uname = req.session.user.username;
      console.log(uname);
      
      /*TODO: WHY THE FUCK INSERTION IS NOT BEING DONE IN DATABASE?*/

      var sql = "INSERT INTO `rps`(`uname`,`rpname`,`rpdata`) VALUES ('" + uname + "','" + fn + "','" + data + "')";

      var query = db.query(sql, function(err, result) {

        console.log("Succesfully Done.");
      });      
	   });
  }
});
var upload = multer({ storage : storage}).single('userPdf');

app.get("/", function(req, res){
  var user =  req.session.user,
  userId = req.session.userId;
   // console.log('ddd='+userId);
  if(userId == null){
     res.redirect("/login");
     return;
  }
	var message = 'Stupid Research Paper Catalog';
	var message1 = '';
	res.render('rpc/rpc',{message: message, message1: message1});
})

app.post('/upload',function(req,res){
	var message = 'Stupid Research Paper Catalog';
	var message1 = 'Stupid Research Paper uploaded';
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.redirect("../home/dashboard");
    });
});

module.exports = app;