var mongodb = require('./db');


function Post(username, post, time) {
	this.user = username;
	this.post = post;
	if (time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
}


module.exports = Post;

Post.prototype.save = function save(callback) {
	var post = {
		user:this.user,
		post:this.post,
		time:this.time
	};
	// 打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		// 读取post集合
		db.collection('posts', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// 为user添加索引属性
			collection.ensureIndex('user', {unique:true});
			// 写入一条post文档
			collection.insert(post, {safe:true}, function(err, post) {
				mongodb.close();
				callback(err, post);
			});
		});
	});
};

// 由用户名返回post数组
Post.get = function get(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('post', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			// 查询posts集合内user属性值为username的post
			var query = {};
			if (username) {
				query = {user:username};
			}
			// 查询结果按照时间降序排列
			collection.find(query).sort({time:-1}).toArray(function(err, docs) {
				mongodb.close();
				if (err) {
					callback(err, null);
				}
				var posts = [];
				docs.forEach(function(doc, index) {
					if (doc) {
						var post = new Post(doc.user, doc.post, doc.time);
						posts.push(post);
					}
				})
				callback(err, posts);
			});
		});
	})
}