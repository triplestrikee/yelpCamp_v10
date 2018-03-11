var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

mongoose.connect("mongobd://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//schema setup
var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String
});

var Campground = mongoose.model("Campground",campgroundSchema);


Campground.create(
    {
        name:"vancouver", 
        image:"https://wikitravel.org/upload/shared//thumb/1/1b/Cambie_street.jpg/400px-Cambie_street.jpg"
    }, function(err,newlyCreated){
        if(err){
        console.log(err);
    }else{
        console.log("newly added");
        console.log(newlyCreated);
        
        
    }
    
});