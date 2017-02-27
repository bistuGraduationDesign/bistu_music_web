var mongodb = require('./db');

function User(user) {
  this.agent = user.agent;
  this.language = user.language;
  this.ip = user.ip;
  this.cookies = user.cookies;
};

module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
  var date = new Date(Date.now() + (8 * 60 * 60 * 1000));
  
  var user = {
    time: date,
    agent: this.agent,
    language: this.language,
    ip: this.ip,
    cookies: this.cookies
  };
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err); //错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(user, {
        safe: true
      }, function(err, user) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, user.ops[0]); //成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};