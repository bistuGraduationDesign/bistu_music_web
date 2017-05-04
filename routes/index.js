var crypto = require("crypto"); //加密算法

var multipart = require("connect-multiparty");
var async = require("async");

var settings = require("../settings");
var User = require("../models/user");
var Music = require("../models/music");
var Comment = require("../models/comment");

var verCode = require("./verCode");
var checkStatus = require("./checkStatus");
var upload = require("./upload");

module.exports = function(app) {

  app.get('/', checkStatus.checkNotLogin);
  app.get("/", function(req, res) {
    res.render("index", {});
  });

  app.get('/signin', checkStatus.checkNotLogin);
  app.get("/signin", function(req, res) {
    res.render("signin", {});
  });

  app.get('/verificationCode/:random', checkStatus.checkNotLogin);
  app.get('/verificationCode/:random', function(req, res) {
    verCode.changeVerCode(req, res);
  });

  app.post('/checkVerCode', checkStatus.checkNotLogin);
  app.post('/checkVerCode', function(req, res) {
    verCode.checkVerCode(req, res);
  });

  app.post('/signin', checkStatus.checkNotLogin);
  app.post('/signin', function(req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.name, function(err, user) {
      if (!user) {
        var msg = {
          state: false,
          info: "用户不存在"
        };
        return res.send(msg);
        //用户不存在则跳转到登录页
      }
      //检查密码是否一致
      if (user.password != password) {
        var msg = {
          state: false,
          info: "密码错误"
        };
        //密码错误则跳转到登录页
      }
      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      var msg = {
        state: true,
        info: "sussess"
      };
      return res.send(msg);
    });
  });

  app.post('/reg', checkStatus.checkNotLogin);
  app.post('/reg', function(req, res) {
    var password = req.body.password;
    var password_re = req.body['passwordrepeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      var msg = {
        state: false,
        info: "两次输入的密码是不一致"
      };
      return res.send(msg);
    }
    // 生成密码的 md5 值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');

    var newUser = new User({
      name: req.body.name,
      password: password,
      email: req.body.email
    });

    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user) {
      if (user) {
        var msg = {
          state: false,
          info: "用户已存在"
        };
        return res.send(msg);
      }
      //如果不存在则新增用户
      newUser.save(function(err, user) {
        if (err) {
          var msg = {
            state: false,
            info: "请重试"
          }; //注册失败返回主册页
          return res.send(msg);
        }
        // req.session.user = user; //用户信息存入 session
        var msg = {
          state: true,
          info: "sussess"
        };
        return res.send(msg); //注册成功后返回主页
      });
    });
  });

  app.get('/music', checkStatus.checkLogin);
  app.get("/music", function(req, res) {
    var user = req.session.user;
    // an example using an object instead of an array
    async.waterfall([
      function(callback) {
        var typeArray = user['type'];
        var type;
        if (typeArray[0] == typeArray[1]) {
          type = typeArray[0];
        } else {
          type = typeArray[2];
        }
        Music.getByType(type, function(err, music) {
          if (err) {
            callback("请重试", null);
          } else {
            callback(null, music);
          }
        });
      },
      function(Typemusic, callback) {
        Music.getByHot(function(err, music) {
          if (err) {
            callback("请重试", null);
          } else {
            callback(null, Typemusic, music);
          }
        });
      },
      function(Typemusic, Hotmusic, callback) {
        Music.getByTime(function(err, music) {
          if (err) {
            callback("请重试", null);
          } else {
            callback(null, Typemusic, Hotmusic, music);
          }
        });
      }
    ], function(err, Typemusic, Hotmusic, Timemusic) {
      // console.log("Typemusic:" + JSON.stringify(Typemusic));
      // console.log("Hotmusic:" + JSON.stringify(Hotmusic));
      // console.log("Timemusic:" + JSON.stringify(Timemusic));
      if (err) {
        var msg = {
          state: false,
          info: err
        }; //注册失败返回主册页
        return res.send(msg);
      } else {
        res.render("music", {
          Typemusic: Typemusic,
          Hotmusic: Hotmusic,
          Timemusic: Timemusic,
          user: user
        });
      }
    });


  });

  app.get('/upload', checkStatus.checkLogin);
  app.get("/upload", function(req, res) {
    res.render("upload", {});
  });

  app.post('/upload-file', checkStatus.checkLogin);
  app.post("/upload-file", multipart(), function(req, res) {
    async.waterfall([
      function(callback) {
        Music.getByName(req.body.name, function(err, music) {
          if (music) {
            callback("歌曲已存在");
          } else if (err) {
            callback("请重试");
          } else {
            callback(null);
          }
        })
      },
      function(callback) {
        var fileData = req.files.file_data
        if (fileData[0].type.indexOf("image") >= 0 && fileData[1].type.indexOf("audio") >= 0) {
          upload.select(req, 0, 1, function(err) {
            if (err) {
              callback(err)
            } else {
              callback(null)
            }
          })
        } else if (fileData[1].type.indexOf("image") >= 0 && fileData[0].type.indexOf("audio") >= 0) {
          upload.select(req, 1, 0, function(err) {
            if (err) {
              callback(err)
            } else {
              callback(null)
            }
          })
        } else {
          callback("请输入一个音频，mp3哦，一个图片，jepg哦，么么哒")
        }
      },
      function(callback) {
        var type = 3;
        //摇滚1 民谣2 流行3
        switch (req.body.type) {
          case "摇滚":
            type = 1;
            break;
          case "民谣":
            type = 2;
            break;
          case "流行":
            type = 3;
            break;
        }
        //音乐名、作者、类型、次数
        var newMusic = new Music({
          name: req.body.name,
          author: req.body.author,
          type: type
        });
        //如果不存在则新增用户
        newMusic.save(function(err, music) {
          if (err) {
            callback("请重试");
          }
          callback(null); //成功后返回
        });
      }
    ], function(err, result) {
      if (err) {
        var msg = {
          error: err
        }; //注册失败返回主册页
      } else {
        var msg = {
          state: true,
          info: "sussess"
        };
      }
      return res.send(msg);
    });
  });

  app.post('/play', checkStatus.checkLogin);
  app.post("/play", function(req, res) {

    async.waterfall([
      function(callback) {
        Music.addTimes(req.body.name, function(err) {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        });
      },
      function(callback) {
        User.changeType(req.session.user, req.body.type, function(err) {
          if (err) {
            callback(err);
          } else {
            callback(null);
          }
        })
      }
    ], function(err, result) {
      if (err) {
        var msg = {
          state: false,
          info: err
        };
      } else {
        var msg = {
          state: true,
          info: "sussess"
        };
      }
      return res.send(msg);
    });

  });

  app.post('/getByName', checkStatus.checkLogin);
  app.post("/getByName", function(req, res) {
    Music.getByName_more(req.body.name, function(err, musics) {
      if (err) {
        var msg = {
          state: false,
          info: err
        };
      } else {
        var msg = {
          state: true,
          info: musics
        };
        return res.send(msg);
      }
    });
  });


  app.post('/saveComment', checkStatus.checkLogin);
  app.post("/saveComment", function(req, res) {
    let user = req.session.user;
    if (!user) {
      res.redirect('/sign');
    } else {
      //增加评论
      console.log(req.body);
      let newsname = req.body.name;
      let content = req.body.content;
      var newComment = new comment({
        news: newsname,
        user: user,
        content: content
      });
      newComment.save(function(err, comment) {
        if (err) {
          var msg = {
            state: false,
            info: err
          };
          return res.send(msg);
        }
        var msg = {
          state: true,
          info: '评论完成'
        };
        return res.send(msg);
      });
    }
  });

  app.post('/comment', checkStatus.checkLogin);
  app.post("/comment", function(req, res) {
    Comment.getByName(req.body.music, function(err, musics) {
      if (err) {
        var msg = {
          state: false,
          info: err
        };
      } else {
        var msg = {
          state: true,
          info: musics
        };
        return res.send(msg);
      }
    });
  });

  app.get('/logout', checkStatus.checkLogin);
  app.get("/logout", function(req, res) {
    req.session.user = null;
    res.redirect("/");
  })
}