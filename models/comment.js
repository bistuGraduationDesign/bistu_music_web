var mongodb = require('./db');


function Comment(comment) {
	this.music = comment.music
	this.user = comment.user;
	this.content = comment.content;
};

module.exports = Comment;

//存储评论信息
Comment.prototype.save = function(callback) {
	var date = new Date(Date.now() + (8 * 60 * 60 * 1000));

	var comment = {
		music: this.music,
		user: this.user,
		time: date, //首次上传时间
		content: this.content
	};
	console.log(comment);
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err); //错误，返回 err 信息
		}
		//读取 comment 集合
		db.collection('comment', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err); //错误，返回 err 信息
			}
			//将评论数据插入 comment 集合
			collection.insert(comment, {
				safe: true
			}, function(err, comment) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, comment.ops[0]); //成功！err 为 null，并返回存储后的评论文档
			});
		});
	});
};

Comment.getByName = function(name, callback) {
	//打开数据库
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err); //错误，返回 err 信息
		}
		//读取 comment 集合
		db.collection('comment', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err); //错误，返回 err 信息
			}
			//查找评论名（name键）值为 name 一个文档
			collection.find({
				news: new RegExp(name)
			}, {
				limit: 12
			}).toArray(function(err, comment) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null, comment);
			});
		});
	});
};
