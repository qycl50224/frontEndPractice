var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');

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
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var newUser = new User({
		username: req.body.username,
		password: password
	});
	// 检查用户名是否存在
	User.get(newUser.username, function(err, user) {
		if (user) 
			err = '该用户名已存在';
			console.log(err);
		if (err) {
			req.flash('error', err);
			console.log("返回了");
			return res.redirect('/reg');
		}
		// 如果不存在则创建用户
		newUser.save(function(err) {
			if (err) {
				console.log(err);
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser;
			req.flash('success', '注册成功');
			res.redirect('/');
		});
	});
}


// 注册页
router.login = function(req, res) {
	res.render('login');
};

router.doLogin = function(req, res) {
	// 获取表单的用户名和密码
	var username = req.body.username;
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	// 先看是否存在该账户，再在数据库中找对应的密码，看是否相等
	User.get(username, function(err, user) {
		if (err) {
			console.log(err);
			return res.redirect('login');
		} else {
			if (user) {
				// 存在该账户，检查密码是否匹配
				if (user.password === password) {
					// 密码匹配
					console.log('密码正确');
					req.session.user = user;
					res.redirect('/');
				} else {
					// 密码错误
					console.log('密码错误');
					res.redirect('/login');
				}
			} else {
				// 账户不存在
				console.log('该账户不存在');
				res.redirect('/login');
			}
		};
	});
};

router.logout = function(req, res) {
	req.session.user = null;
	req.flash('success', '成功登出');
	res.redirect('/');
};

module.exports = router;

