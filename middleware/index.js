var Campground=require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj ={}; // empty object

// defined objects of middleware objects

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
       
            Campground.findById(req.params.id,function(err, foundBlog){
               if(err){
                    res.redirect("back");
                }else{
                     // does the user own the campground?
                    console.log(foundBlog.author.id); // mongoose object but when we print it through console it see as string
                    console.log(req.user._id); // string
                    // thats why if(foundBlog.author.id === req.user._id) does work
                   if(foundBlog.author.id.equals(req.user._id)){
                       next();
                   }else{
                      res.redirect("back");
                   }
                   
                }
            });
      }else{
        res.redirect("back"); //this will make the user back from where it comes (previous page)
      }     

}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
       
            Comment.findById(req.params.comment_id,function(err, foundBlog){
               if(err){
                    res.redirect("back");
                }else{
                     // does the user own the campground?
                   if(foundBlog.author.id.equals(req.user._id)){
                       next();
                   }else{
                      res.redirect("back");
                   }
                   
                }
            });
      }else{
        res.redirect("back"); //this will make the user back from where it comes (previous page)
      }   
}

middlewareObj.isLoggedIn=function(req,res,next){
      if(req.isAuthenticated()){
            return next();
       }
          req.flash("error","Please Login First");
          res.redirect("/login");
}

module.exports= middlewareObj;  