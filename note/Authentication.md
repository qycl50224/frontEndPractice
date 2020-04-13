# Authentication

这节讲的是写创建账户，登入账户和登出账户

涉及到数据库的存储

新涉及到的包有：

- **passport**：Passport is Express-compatible authentication middleware for Node.js.
- **passport-local**：Passport strategy for authenticating with a username and password.
- **passport-local-mongoose**：Passport-Local Mongoose is a Mongoose that simplifies building username and password login with Passport.
- **express-session**



### 一些语法

在app.js中

```js
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

```

在user.js中

```js
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
	username: String,
	password: String
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
```



### middleware

```js
app.get("/secret", isLoggedIn, function(req, res){
	res.render("secret");
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
```

中间件`isLoggedIn`是一个函数，这里没有在后面加上括号和参数

关键点就是有一个先后顺序，他先执行中间件，再是后面的函数，有可能在中间件（这里是一个函数）中就返回了

下面是另外一个中间件例子，但是和上面的包有关

```js
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res){
});
```

解决的是输入账号密码后，如果正确就进入账户页面，错误就停留在登入页面



### 给YelpCamp加authentication

关键点

1. 先用上面类似的方法写入登入登出
2. 改写route，让代码更清晰和模块化
3. 对comment和campground进行修改，让他们能够记录并显示他们的作者是谁，这一步有点复杂 ，涉及到ejs和js共同的修改，下面将详细记录





#### 2.用express.Router()

```js

...
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
// 下面的字符串代可以省去route中重复写这些url
app.use("/" ,indexRoutes);
app.use("/campgrounds" ,campgroundRoutes);
app.use("/campgrounds/:id/comments" ,commentRoutes);

```

把之前的route分别放到一个js文件中，然后通过上面这种方式导入

对于每个route的js文件如下

```js
var express = require("express");
// 使用express.Router
var router = express.Router();
...
router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log("SOME THING GOES WRONG!");
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});	
		}
	})
});
...

module.exports = router;
```

先使用`express.Router()`

然后之前的`app.`一律改为`router.`

最后记住导出`router`



#### 3.将comment与author相关联

先修改`Schema`，给`comment`和`campground`的`Schema`加一个`author`

比如`campground`

```js
var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
    //=================================================
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
    //==================================================
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground", campSchema);

```

然后是在`app`里创建保存并使用这个`author`变量

`author`的`id`和`username`通过`req`来访问

当然有个前提是当前已经登陆，不然无法访问到这两个变量，前面有一个中间件`isLoggedIn`来判断

```js
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

// middleware
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
```

同样的让我们来看一下`comment`添加`author`的代码

```js
//Comments Create
router.post("/", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/");
		} else {
			var comment = req.body.comment;
			Comment.create(comment, function(err, comment){
				if(err){
					console.log(err);
					res.redirect("/");
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// console.log("New comment's username will be: " + req.user.username);
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					res.redirect("/campgrounds/" + campground._id);
				}
			})
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
```

可以看到，现有一个创建`comment`的过程，然后还有一个把`comment`与它所对应的`campground`联系起来的过程

就是把这个`comment`**push**到`campground`的`comments`里面

