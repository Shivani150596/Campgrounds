var express =require("express");
var router =express.Router();
var passport=require("passport");
var User=require("../models/user");

// root route
router.get("/",function(req,res){
    res.render("landing");
});



//================
// AUTH ROUTES
//================

// SHOW register form
router.get("/register",function(req,res){
    res.render("register");
});

//handle signup logic
router.post("/register",function(req,res){
     req.body.username;
   req.body.password;
   User.register(new User({username: req.body.username}), req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render('register');
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/campgrounds");
       });
   });
});

// SHOW login form
router.get("/login",function(req,res){
    res.render("login");
});

//handle login logic
router.post("/login",passport.authenticate("local",{
    successRedirect :"/campgrounds",
    failureRedirect :"/login"
    }),function(req,res){
    
});

// lgout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","log out");
    res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login");
}
 module.exports=router;