// ===================
// Campground ROUTES
// ===================
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//Campground index route - show all campgrounds
router.get("/", function(req, res){
    
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{

            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
        }
        
    });
    
});

// Campground new route - Display form
router.get("/new",isLoggedIn, function(req, res){
    res.render("campgrounds/new");
    
});


//Campground create route - add campground to db
router.post("/",isLoggedIn, (req, res)=>{
    //get data from the form and 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name, image:image, description:desc, author:author};
    req.user
    //add the new Campground to db
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log("newly added");
            //console.log(newlyCreated);
            //redirect to campgrounds page
            res.redirect("/campgrounds");
            
        }
        
    });
    
});

//Campground show route
router.get("/:id",function(req, res){
    //find the campground with ID
    //Campground.FindById(req(id), callback)
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground}); 
            //console.log(foundCampground);
        }
    });
    

});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;