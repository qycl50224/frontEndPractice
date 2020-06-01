var mongodb = require('./db');


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
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		};
		// 读取user集和
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close;
				return callback(err);
			}
			// 为name属性添加索引
			collection.ensureIndex('username', {unique:true});
			// 写入user文档
			collection.insert(user, {safe:true}, function(err, user) {
				mongodb.close();
				callback(err, user);
			});
		});
	});
};

User.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取user集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// 查找name属性为username的对象
			collection.findOne({name:username}, function(err, doc) {
				mongodb.close();
				if (doc) {
					// 封装文档为User对象
					var user = new User(doc);
				} else {
					callback(err, null);
				}
			});
		});
	});
};