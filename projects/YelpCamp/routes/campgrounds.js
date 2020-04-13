var express = require("express");
var router = express.Router();




router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log("SOME THING GOES WRONG!");
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});	
		}
	})
	
});


// NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new")
});

// SHOW show more info about one campground
router.get("/:id", function(req, res){
	//find the campground with the provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template with that campground
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});		
		}
	});
	
});


// CREATE - add new campground to DB
router.post("/", isLoggedIn, function(req, res){
	console.log(req.body);
	var newcampground = {
		"name": req.body.name,
		"image": req.body.image,
		"description": req.body.description,
		"author": {
			id: req.user._id,
			username: req.user.username
		}
	}
// Create a new campground and save to DB
	Campground.create(newcampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			console.log(newcampground);
			res.redirect("/campgrounds");
		}
	});
});


function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;