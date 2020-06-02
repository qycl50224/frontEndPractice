var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var setting = require('./setting');
var session = require('express-session'); // 注意这个放在下面这个之上
var MongoStore = require('connect-mongo')(session);

var middleware = require('./middleware');




var User = require('./models/user');


var routes = require('./routes');

var app = express();

var port = process.env.PORT || 3000;



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: setting.cookie_secret,
	store: new MongoStore({
		db: setting.db,
		url:'mongodb://localhost/microblog'
	})
}));

app.use(logger('dev'));
app.use(express.json());


// 给所有页面，用于上面的导航栏，添加一个本地变量
app.use(function(req, res, next){
	console.log("从session添加本地变量user");
	res.locals.user = req.session.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.get('/', routes.index);
app.get("/u/:user", routes.user);
app.post("/post", middleware.checkLogin, routes.post);
app.get('/reg', middleware.checkNotLogin, routes.reg);
app.post('/reg', middleware.checkNotLogin, routes.doReg);



app.get('/login', middleware.checkNotLogin, routes.login);
app.post('/login', middleware.checkNotLogin, routes.doLogin);
app.get('/logout', middleware.checkLogin, routes.logout);


// 视图交互
app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	var err = req.flash('error');
	var success = req.flash('success');
	res.locals.error = err.length? err:null;
	res.locals.success = success.length? success:null;
	next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
