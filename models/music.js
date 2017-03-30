var mongodb = require('./db');

function Music(music) {
  this.name = music.name;
  this.author = music.author;
  this.type = music.type;
};

module.exports = Music;

//存储用户信息
Music.prototype.save = function(callback) {
  var date = new Date(Date.now() + (8 * 60 * 60 * 1000));

  var music = {
    name: this.name,
    author: this.author,
    type: this.type,
    times: 0,
    time: date
  };
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err); //错误，返回 err 信息
    }
    //读取 musics 集合
    db.collection('musics', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //错误，返回 err 信息
      }
      //将用户数据插入 musics 集合
      collection.insert(music, {
        safe: true
      }, function(err, music) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, music.ops[0]); //成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};

Music.getByName = function(name, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err); //错误，返回 err 信息
    }
    //读取 musics 集合
    db.collection('musics', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name: name
      }, function(err, music) {
        mongodb.close();
        if (err) {
          return callback(err); //失败！返回 err
        }
        callback(null, music); //成功！返回查询的用户信息
      });
    });
  });
};

Music.getByType = function(type, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err); //错误，返回 err 信息
    }
    //读取 musics 集合
    db.collection('musics', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.find({
        type: type
      }, function(err, musics) {
        mongodb.close();
        if (err) {
          return callback(err); //失败！返回 err
        }
        callback(null, musics); //成功！返回查询的用户信息
      }).limit(12);
    });
  });
};

Music.getByHot = function(callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err); //错误，返回 err 信息
    }
    //读取 musics 集合
    db.collection('musics', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.find([{
          type: type
        },
        // First sort all the docs by name
        {
          $sort: {
            times: 1
          }
        },
        // Take the first 100 of those
        {
          $limit: 12
        }
      ], function(err, musics) {
        mongodb.close();
        if (err) {
          return callback(err); //失败！返回 err
        }
        callback(null, musics); //成功！返回查询的信息
      });
    });
  });
};

Music.getByTime = function(callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err); //错误，返回 err 信息
    }
    //读取 musics 集合
    db.collection('musics', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.find([{
          type: type
        },
        // First sort all the docs by name
        {
          $sort: {
            time: 1
          }
        },
        // Take the first 100 of those
        {
          $limit: 12
        }
      ], function(err, musics) {
        mongodb.close();
        if (err) {
          return callback(err); //失败！返回 err
        }
        callback(null, musics); //成功！返回查询的信息
      });
    });
  });
};