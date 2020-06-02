var mongodb = require('./db');
var MongoClient = require('mongodb').MongoClient;
var setting = require('../setting');

var client = MongoClient(setting.url);



function User(user) {
	this.username = user.username;
	this.password = user.password;
}

module.exports = User;

User.prototype.save = function save(callback) {
	var user = {
		username: this.username,
		password: this.password
	};
	
	client.connect(function(err, client) {
		if (err) {
			console.log(err);
			return callback(err);
		} else {
			console.log("成功连接到服务器");
			var db = client.db(setting.db);
			db.collection('users', function(err, collection) {
				if (err) {
					client.close();
					console.log("断开服务器连接");
					return callback(err);
				}
				// 为name属性添加索引
				collection.createIndex('username', {unique:true});
				// 写入user文档
				collection.insertOne(user, {safe:true}, function(err, user) {
					client.close();
					console.log("断开服务器连接");
					return callback(err, user);
				});
			});
		}
	});
	// 读取user集和
	
	
};

User.get = function get(username, callback) {
	
	client.connect(function(err, client) {
		if (err) {
			return callback(err);
		} else {
			console.log("成功连接到服务器");
			var db = client.db(setting.db);
			// 读取user集合
			db.collection('users', function(err, collection) {
				if (err) {
					client.close();
					console.log("断开服务器连接");
					return callback(err);
				}
				// 查找name属性为username的对象
				collection.findOne({name:username}, function(err, doc) {
					
					if (doc) {
						// 封装文档为User对象
						var user = new User(doc);
						client.close();
						console.log("断开服务器连接");
					} else {
						client.close();
						console.log("断开服务器连接");
						return callback(err, null);
					}
				});
			});
		}
	});
	
};