var express = require('express');
var app = express.Router();


app.get("/", function(req, res){
   var message = '';
   res.render('index',{message: message});
 
})

app.post("/signup", function(req, res){
   message = '';
   var post  = req.body;
   var name= post.user_name;
   var pass= post.password;
   var email= post.email;

   var sql = "INSERT INTO `user`(`username`,`password`,`email`) VALUES ('" + name + "','" + pass + "','" + email + "')";

   var query = db.query(sql, function(err, result) {

      message = "Succesfully! Your account has been created.";
      res.render('signup.ejs',{message: message});
   });
});

app.get("/signup", function(req, res){
   message = '';
   res.render('signup',{message: message});
})

app.post("/login", function(req, res){
   var message = '';
   var sess = req.session; 
   var post  = req.body;
   var name= post.user_name;
   var pass= post.password;
  
   var sql="SELECT id, username, email FROM `user` WHERE `username`='"+name+"' and password = '"+pass+"'";                           
   db.query(sql, function(err, results){      
      if(results.length){
         req.session.userId = results[0].id;
         req.session.user = results[0];
         console.log(results[0].id);
         res.redirect('/home/dashboard');
      }
      else{
         message = 'Wrong Credentials.';
         res.render('index.ejs',{message: message});
      }
              
   });
});

app.get("/login", function(req, res){
   var message = '';
   res.render('index.ejs',{message: message});
})

app.get("/home/dashboard", function(req, res, next){
   var user =  req.session.user,
   userId = req.session.userId;
   // console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `user` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });
})

app.get("/home/logout",function(req, res){
      req.session.destroy(function(err) {
      res.redirect("/login");
   })
})

app.get("/home/profile", function(req, res){
      var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `user` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
})

module.exports = app;