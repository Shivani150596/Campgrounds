var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      =require("connect-flash"),
    passport   =require("passport"),
    localStrategy =require("passport-local"),
    Comment    =require("./models/comment"),
    Campground = require("./models/campground"),
    User       =require("./models/user"),
    methodOverride= require("method-override"),
    seedDB     = require("./seeds");
    
    
//requiring routes    
var  commentRoutes =require("./routes/comments"),
     campgroundRoutes =require("./routes/campgrounds"),
     indexRoutes =require("./routes/index");
   
    
mongoose.connect("mongodb://localhost/yelp_camp2") ;   
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();    //seed the DB for creating user mainually u

// passport config
app.use(require("express-session")({
    secret:"once again rustty is best",
    resave :false,
    saveUninitialized :false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// to maker aviable the currentuseras(requesting user) to every template
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error =req.flash("error");//anytthng in flah has excess to each template through message
     res.locals.success =req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes); //1t parameter is get appended tp each rout path of campgroundRoutes files



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("the YELPCAMP SERVER HAS STARTED");
});