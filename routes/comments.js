// ===================
// COMMENT ROUTES
// ===================
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment =require("../models/comment");

// Comment new route - display a form for new post
router.get("/new",isLoggedIn, function(req, res){
    //find campground id
    Campground.findById(req.params.id,function(err, campground){
       if(err){
           console.log(err);
       } else { 
            res.render("comments/new", {campground:campground});
       }
    });

});
// Comment create route - grab the data form 
router.post("/",isLoggedIn, function(req, res){
    //look up campground by id
        Campground.findById(req.params.id,function(err, campground){
       if(err){
           console.log(err);
       } else { 
            //create new comment
            Comment.create(req.body.comment,function(err, comment){
                if(err){
                console.log(err);
                } else {
            //connect new comment to campground
            //redirect campground show page
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect("/campgrounds/" + campground._id);
                }
            });

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


module.exports = router;