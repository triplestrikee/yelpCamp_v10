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

// Edit route
router.get("/:id/edit",checkCampgroundOwnership, function(req, res) {
         Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground});
          });
});

// update route
router.put("/:id",function(req, res){
   //find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
           console.log(err)
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   })
   //redirect to showpage
    
});

// Destory campground route
router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
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

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//is user logged in?
function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
              //does user own the campground?
              if(foundCampground.author.id.equals(req.user._id)){
                 next();
              } else {
                   res.redirect("back");
              }
             }
        });
    } else {
        res.redirect("back");
    }
}
module.exports = router;