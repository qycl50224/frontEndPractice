var express 	   = require("express"),
	bodyParser     = require("body-parser"),
	mongoose 	   = require("mongoose"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local")
	Campground     = require("./models/campground"),
	Comment        = require("./models/comment"),
	User           = require("./models/user"),
	seedDB         = require("./seeds"),
	app 		   = express();

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
// seedDB();

// passport configuration
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// 给所有页面，用于上面的导航栏，添加一个本地变量
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use("/" ,indexRoutes);
app.use("/campgrounds" ,campgroundRoutes);
app.use("/campgrounds/:id/comments" ,commentRoutes);




app.listen(3000, process.env.IP, ()=>{
	console.log("YelpCamp Start working!!!");
});