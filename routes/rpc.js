var express = require('express');
var multer  =   require('multer');
var path = require('path');
var app = express();
var pdfUtil = require('pdf-to-text');
var variables = require("../variables.js")
var fs = require("fs");
var elasticsearch = require("elasticsearch");

var User = require("../models/user").user_model;
var Rps = require("../models/rps").rps_model;
var VerifyToken = require("./VerifyToken");

var client        = new elasticsearch.Client({
                                host: variables.bonsai_url,
                                requestTimeout: Infinity
                            });


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    file_path = variables.upload_path + req.session.userId + "/" + file.originalname;

    fs.stat(file_path, function(err, stat) {
      if(err == null) {
          console.log('File exists');
          return
          // res.redirect("../home/dashboard");
      } else if(err.code == 'ENOENT') {
          // file does not exist
          
          pdf_path = file_path;
          console.log(pdf_path);

          // File being uploaded to that userid folder
          callback(null, './uploads/' + req.session.user.id);
          pdfUtil.pdfToText(pdf_path, function(err, data) {
            if (err) throw(err);
            // console.log(data); //Need to store it in DB    

            var userId = req.session.user.id;            
            var emailid = req.session.user.email;
            // console.log("userid: " + emailid + userId);
            Rps.forge({
              user_id: userId,
              email_id: emailid,
              rpname: file.originalname,
              rplocation: pdf_path,
              rpdata: data
            }, { method: "insert"})
              .save()
              .then(function(response){
                console.log("Data Inserted");
                var response_json = response.toJSON();
                  client.create({
                    index: variables.bonsai_index,
                    type: variables.bonsai_type,
                    id: Date.now(),
                    body:{
                      rpname: response_json.rpname,
                      rptext: response_json.rpdata,
                      userid: response_json.user_id,
                      created_at: Date.now()
                    }
                  })
                    .then(function(err, res){
                      if(error){
                        console.error(error);
                      }
                      else{
                        console.log("Successfully Done.");
                      }
                    })
              }).catch(function(err){
                console.error(err);
              })

          });

          
      } else {
          console.log('Some other error: ', err.code);
      }
    });

  },
  filename: function (req, file, callback) {
  	var fn = file.originalname;
  	var pdf_path = variables.upload_path + req.session.userId + "/" +fn;
    // console.log("pdf path: "+ pdf_path);
    callback(null, fn);
  }
});
var upload = multer({ storage : storage}).single('userPdf');

app.get("/", function(req, res){
  var user =  req.session.user,
  userId = req.session.userId;

	var message = 'Stupid Research Paper Catalog';
	var message1 = '';
	res.render('rpc/rpupload',{message: message, message1: message1});
})

app.post('/upload',function(req,res){
	var message = 'Stupid Research Paper Catalog';
	var message1 = 'Stupid Research Paper uploaded';
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file, With Error: " + err);
        }
        res.redirect("../home/dashboard");
    });
});

app.get("/collections", function(req, res){
  res.render("rpc/rpview");
})

app.post("/collections", function(req, res){
  var word = req.body.word;
  // console.log(word);
  client.search({
    index: variables.bonsai_index,
    type: variables.bonsai_type,
    body:{
      query:{
        bool:{
          must:[
            {
              match:{
                rptext: word
              }
            }
          ]
        }
      },
      highlight: {
        number_of_fragments: 8,
        fragment_size: 100,
        fields: {
          rptext: {
            pre_tags: ["<strong>"],
            post_tags: ["</strong>"]
          }
        }
      }
    }
  })
  .then(function(data, err){
    if(err){
      res.sendStatus(500);
      console.error(err)
    }
    else{
      if(data.hits.hits.length===0){
        res.redirect("collections")
      }
      else{
        res.render("rpc/rpesres", {
          data: data.hits.hits
        });
      }  
    }  
    
  })
})

module.exports = app;