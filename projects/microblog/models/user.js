var mongodb = require('./db');
var MongoClient = require('mongodb').MongoClient;
var setting = require('../setting');

var client = MongoClient(setting.url, {useUnifiedTopology: true });



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
			console.log('成功连接到服务器--for save');
			var db = client.db(setting.db);
			db.collection('users', function(err, collection) {
				if (err) {
					client.close();
					console.log('断开服务器连接4');
					return callback(err);
				}
				// 为name属性添加索引
				collection.createIndex('username', {unique:true});
				// 写入user文档
				collection.insertOne(user, {safe:true}, function(err, user) {
					if (err) {
						client.close();
						console.log('断开服务器连接5');
						return callback(err);
					} else {
						console.log('保存成功');
						client.close();
						console.log('断开服务器连接6');	
						callback(err, user);
					}
					
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
			console.log('成功连接到服务器--for get');
			var db = client.db(setting.db);
			// 读取user集合
			db.collection('users', function(err, collection) {
				if (err) {
					client.close();
					console.log('断开服务器连接1');
					return callback(err);
				}
				// 查找name属性为username的对象
				collection.findOne({username:username}, function(err, doc) {
					if (err) {
						console.log(err);
						return callback(err);
					} else {
						if (doc) {
							// 封装文档为User对象
							console.log('在数据库中找到该用户');
							var user = new User(doc);
							client.close();
							console.log('断开服务器连接2');
							callback(err, user); // 返回该用户
						} else {
							console.log('未能在数据库中找到该用户');
							client.close();
							console.log('断开服务器连接3');
							callback(err, null);
						}
					}
				});
			});
		}
	});
	
};