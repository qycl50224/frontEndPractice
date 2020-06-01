var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var setting = require('./setting');
var session = require('express-session');

var User = require('./models/user');


var routes = require('./routes');

var app = express();

var port = process.env.PORT || 3000;

// connect to database
mongoose.connect("mongodb://localhost/microblog");

// view engine setup
app.configure(function(){
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.use(bodyParser);
	app.use(methodOverride("_method"));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(session({
		secret: setting.cookie_secret,
		store: new MongoStore({
			db: setting.db
		})
	}));

	app.use(logger('dev'));
	app.use(express.json());
});

app.get('/', routes.index);
app.get("/u/:user", routes.user);
app.post("/post", routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);



app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);


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

app.listen(port, process.env.IP, ()=>{
	console.log("YelpCamp Start working!!!");
});

module.exports = app;
