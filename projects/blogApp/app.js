var express    	   = require("express"),
	bodyParser     = require("body-parser"),
	mongoose       = require("mongoose"),
	app            = express(),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs");


mongoose.connect("mongodb://localhost/blog_app");

var blogSchema = new mongoose.Schema({
	 title: String,
	 image: String,
	 body: String,
	 create: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRIrAS16c2tMDVB4D3Zl1UUneTPBm5aB4mLi6jwHzM88R6n7rHD&usqp=CAU",
// 	body: "HELLO THIS IS A BLOG POST"
// })
// RESTful ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs");
});


// INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("SOME THING GOES WRONG!");
		} else {
			res.render("index", {blogs: blogs});		
		}
	});
	
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");	
});


// CREATE ROUTE
app.post("/blogs", function(req, res){
	var newBlog = req.body.blog;
	console.log(req.body);
	console.log("================");
	newBlog.body = req.sanitize(newBlog.body);
	console.log(req.body);
	Blog.create(newBlog, function(err, newBlog){
		if(err){
			console.log("ERROR!");
		} else {
			res.redirect("/blogs");		
		}
	});
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	})
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundedBlog});
		}
	});
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.listen(3000, ()=>{
	console.log("BlogApp start working");
})