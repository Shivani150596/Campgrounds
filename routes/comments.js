var express =require("express");
var router =express.Router({mergeParams:true});
var Campground =require("../models/campground");
var Comment =require("../models/comment");
var middleware=require("../middleware/index");  // requiring the index file
// =========================
// comments routes
// ==========================

//comments new
router.get("/new",middleware.isLoggedIn,function(req,res){  // for using the index file middleware defined function =>middlewareObj.object which in this case is functons
    // find by ID
    console.log(req.params.id);
    Campground.findById(req.params.id,function(err,campgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("comments/new",{campgrounds:campgrounds});
        }
    });
   
});

// comments create
router.post("/",middleware.isLoggedIn,function(req,res){
    //lookup comments through id
     Campground.findById(req.params.id,function(err,campgrounds){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            //create a new comment 
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    // add usernsame and ID to comment
                    comment.author.id =req.user._id;
                    comment.author.username=req.user.username;
                   comment.save();
                    campgrounds.comments.push(comment);
                    campgrounds.save();
                    res.redirect("/campgrounds/"+campgrounds._id);
                }
            });
        }
    });
       
});
//commentys edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
             res.render("comments/edit",{campgrounds_id:req.params.id,comment:foundComment});
        }
    });
});  

// comment update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/campgrounds/"+req.params.id);
       }
   });
});

//comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });  
});





module.exports =router;