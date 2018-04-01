var express = require('express');
var app = express.Router();
var fs = require("fs");

var User = require("../models/user").user_model;
var Rps = require("../models/rps").rps_model;
var VerifyToken = require("./VerifyToken");

app.get("/", function(req, res){
   var message = '';
   res.render('index',{message: message});
 
})

app.post("/signup", function(req, res){
   message = '';
   var name= req.body.user_name;
   var pass= req.body.password;
   var email= req.body.email;

   User.forge({
        username: name,
        password: pass,
        email: email
    }, {method: "insert"})
      .save()
      .then(function(response){
         // console.log("response: " + JSON.stringify(response, null, "  "));
         response_json = response.toJSON();
         path = "./uploads/"+ response_json.id;
         fs.mkdirSync(path);
         res.redirect("/login");
      }).catch(function(reason){
         console.error(reason);
      })
});

app.get("/signup", function(req, res){
   message = '';
   res.render('signup',{message: message});
})

app.post("/login", function(req, res){
   var message = '';
   var sess = req.session;
   var name= req.body.user_name;
   var pass= req.body.password;

   User.where({
      username: name,
      password: pass
   })
      .fetch()
      .then(function(user){
         if(user===null){
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
         else{
            user1 = user.toJSON();            
            req.session.userId = user1.id;
            req.session.user = user1           
            res.redirect('/home/dashboard');
         }
      })
});

app.get("/login", function(req, res){
   var message = '';
   res.render('index.ejs',{message: message});
})

app.get("/home/dashboard", VerifyToken, function(req, res, next){
   var user =  req.session.user,
   userId = req.session.userId;
   res.render('dashboard.ejs', {user:user});    
})

app.get("/home/logout",function(req, res){
      req.session.destroy(function(err) {
      res.redirect("/login");
   })
})

app.get("/home/profile", VerifyToken, function(req, res){
   var userId = req.session.userId;
   // console.log(userId);

   Rps.where({
      user_id:userId
   })
      .fetchAll()
      .then(function(user){
         user1 = user.toJSON();
         res.render('profile', {data: user1});
      })
})

module.exports = app;