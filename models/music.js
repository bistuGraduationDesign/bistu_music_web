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
    name: this.name, //音乐名
    author: this.author, //音乐作者
    type: this.type, //音乐类型
    times: 0, //音乐播放次数，用以统计热度
    time: date //首次上传时间
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
    db.collection('musics', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err); //错误，返回 err 信息
      }
      //返回只包含 name、time、title 属性的文档组成的存档数组
      collection.find({
        "type": type
      }, {
        limit: 12
      }).toArray(function(err, musics) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, musics);
      });
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
      collection.find({}, {
        limit: 12
      }).sort({
        times: -1
      }).toArray(function(err, musics) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, musics);
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
      collection.find({}, {
        limit: 12
      }).sort({
        time: -1
      }).toArray(function(err, musics) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, musics);
      });
    });
  });
};

//更新一篇文章及其相关信息
Music.addTimes = function(name, callback) {
  //打开数据库
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('musics', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.findOne({
        "name": name
      }, function(err, music) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        music.times = music.times++;
        //更新文章内容
        collection.update({
          "name": name
        }, {
          $set: {
            music: music
          }
        }, function(err) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(null);
        });
      });
    });
  });
}