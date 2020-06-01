var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.index = function(req, res, next) {
  res.render('index');
};

router.user = function(req, res) {
};

router.post = function(req, res) {
};

router.reg = function(req, res) {
	res.render('reg');
};

router.doReg = function(req, res) {
	var newUser = new User({username: req.body.username});
	if(req.body.code === 'sduwh'){
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				console.log(err);
				req.flash("error", err.message);
				return res.render("reg");
			} else {
				passport.authenticate("local")(req, res, function(){
					req.flash("success",  user.username + " 已经上线");
					res.redirect("/index");
				});	
			}
		});
	} else {
		req.flash("error: false code");
		res.redirect("/reg");
	}
};


router.login = function(req, res) {
	res.render('login');
};

router.doLogin = function(req, res) {
};

router.logout = function(req, res) {
};

module.exports = router;
