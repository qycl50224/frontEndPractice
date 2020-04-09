var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

mongoose.connect("mongodb://localhost/authen_demo");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
	secret: "Chen is a great singer",
	resave: false,
	saveUninitialized: false
}));
//用passport必须有下面这两行代码
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
//下面是为了访问session的代码，也必须有
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res){
	res.render("home");
})

app.get("/secret", isLoggedIn, function(req, res){
	res.render("secret");
})


// Routes

// show sign up form
app.get("/register", function(req, res){
	res.render("register");
});

// handling user sign up
app.post("/register", function(req, res){
	req.body.username
	req.body.password
	//这里没有把密码输入到数据库中是因为这样不安全
	//这个register函数会把第二个参数也就是password hash化
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		})
	});
});

// LOGIN
app.get("/login", function(req, res){
	res.render("login");
});
// a middleware, some code run before final res
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res){
});

// LOGOUT
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, ()=>{
	console.log("Server started....");
})