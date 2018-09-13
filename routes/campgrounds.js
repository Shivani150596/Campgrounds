var express =require("express");
var router =express.Router();
var Campground =require("../models/campground");
var middleware =require("../middleware/index"); 


// INDEX-show all campgrounds
router.get("/",function(req,res){
  
   // get all the campgrounds from db
   Campground.find({},function(err,allCampgrounds){
       if(err){
           console.log(err);
       }else{
            res.render("campgrounds",{campgrounds:allCampgrounds,currentUser: req.user});
       }
   });
});

 
// CREATE-add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
   
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var author ={
        id:req.user._id,
        username:req.user.username
    };
    var newCampgrounds={name: name,image: image,description:desc,author:author};
    Campground.create(newCampgrounds,function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
           console.log(newlyCreated);
           res.redirect("/campgrounds"); 
       }
    });
});

// NEW - show form to create a new campground
router.get("/new",middleware.isLoggedIn,function(req,res){     //here the actual route path is "/campgrounds/new"
    res.render("new");
});

// SHOW- shows more info about one campground
router.get("/:id",function(req,res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgrounds){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampgrounds);
          res.render("show",{campgrounds:foundCampgrounds});    
        }
    });
  
});


// EDIT ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
     Campground.findById(req.params.id,function(err, foundBlog){
          res.render("edit.ejs",{campgrounds:foundBlog});
                 
     });
});
// UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // find and update the corect campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campgrounds,function(err,updatedBlog){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
             }
    });
});


//DELETE ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
            res.redirect("/campgrounds");
       }
   });
});



     


module.exports =router;