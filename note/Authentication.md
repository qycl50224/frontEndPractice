# Authentication

这节讲的是写创建账户，登入账户和登出账户

涉及到数据库的存储

新涉及到的包有：

- **passport**：Passport is Express-compatible authentication middleware for Node.js.
- **passport-local**：Passport strategy for authenticating with a username and password.
- **passport-local-mongoose**：Passport-Local Mongoose is a Mongoose that simplifies building username and password login with Passport.
- express-session



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

