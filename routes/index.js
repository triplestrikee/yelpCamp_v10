// ===================
// Index ROUTES
// ===================
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//landing page root route
router.get("/", function(req, res){
    res.render("landing");
});

// ===================
// auth ROUTES
// ===================

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});
// handle the form
router.post("/register",function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
        
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handle login form
// midware
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }), function(req, res) {
       
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;