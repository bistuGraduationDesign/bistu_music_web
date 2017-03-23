var path = require("path");
var fs = require("fs");
var crypto = require('crypto');
//captcha
var ccap = require('ccap');
var multipart = require('connect-multiparty');

var settings = require("../settings");
var User = require("../models/user");
var Music = require("../models/music");

//captcha
var captcha = ccap({
  width: 256, //set width,default is 256
  height: 60, //set height,default is 60
  offset: 40, //set text spacing,default is 40
  quality: 600, //set pic quality,default is 50
  fontsize: 67, //set font size,default is 57
});

function changeVerCode(req, res) {
  var captchaArr = captcha.get(); //生成新的验证码
  var captchaText = captchaArr[0],
    captchaBuffer = captchaArr[1];
  req.session.verCode = captchaText;
  console.log("changeVerCode：" + req.session.verCode);
  res.end(captchaBuffer);
}

function checkVerCode(req, res) {
  var msg;
  console.log(req.body.verCode);
  console.log(req.session.verCode);
  if (req.session.verCode) {
    console.log("checkVerCode:" + req.body.verCode);
    console.log("checkVerCode:" + req.body.verCode.toUpperCase());
    console.log("checkVerCode:" + req.session.verCode.substring(0, 4));
    if (req.body.verCode.toUpperCase() == req.session.verCode.substring(0, 4)) {
      msg = {
        state: true,
        info: "验证码正确"
      };
      return res.send(msg);
    } else {
      msg = {
        state: false,
        info: "验证码错误"
      };
      return res.send(msg);
    }
  }
};

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index", {});
  });

  app.get("/signin", function(req, res) {
    res.render("signin", {});
  });
  app.get('/verificationCode/:random', function(req, res) {
    changeVerCode(req, res);
  });
  app.post('/checkVerCode', function(req, res) {
    console.log("in checkVerCode")
    checkVerCode(req, res);
  });


  app.post('/signin', function(req, res) {
    var msg;
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    //console.log(req.body.name);
    User.get(req.body.name, function(err, user) {
      if (!user) {
        msg = {
          state: false,
          info: "用户不存在"
        };
        return res.send(msg);
        //用户不存在则跳转到登录页
      }
      //检查密码是否一致
      if (user.password != password) {
        msg = {
          state: false,
          info: "密码错误"
        };
        //密码错误则跳转到登录页
      }

      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      msg = {
        state: true,
        info: "sussess"
      };
      return res.send(msg);

      // res.redirect('/');//登陆成功后跳转到主页
    });
  });

  app.post('/reg', function(req, res) {
    var msg;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password_re = req.body['passwordrepeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      console.log("in");
      msg = {
        state: false,
        info: "两次输入的密码是不一致"
      };
      return res.send(msg);
    }
    // 生成密码的 md5 值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('hex');
    console.log(req.body.name);
    console.log(password);
    console.log(req.body.email);
    var newUser = new User({
      name: req.body.name,
      password: password,
      email: req.body.email
    });

    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user) {
      if (user) {
        msg = {
          state: false,
          info: "用户已存在"
        };
        return res.send(msg);
      }
      //如果不存在则新增用户
      newUser.save(function(err, user) {
        if (err) {
          msg = {
            state: false,
            info: "请重试"
          }; //注册失败返回主册页
          return res.send(msg);
        }
        console.log(user);
        // req.session.user = user; //用户信息存入 session
        msg = {
          state: true,
          info: "sussess"
        };
        return res.send(msg); //注册成功后返回主页
      });
    });
  });
  app.get("/music", function(req, res) {
    console.log(req.session.user);
    var user = req.session.user;
    Music.getByType(user['type'], function(err, music) {
      if (err) {
        msg = {
          state: false,
          info: "请重试"
        }; //注册失败返回主册页
        return res.send(msg);
      }

    });
    res.render("music", {});
  });

  app.get("/upload", function(req, res) {
    res.render("upload", {});
  });
  //音乐名、作者、类型、次数
  app.post("/upload-file", multipart(), function(req, res) {
    //get filename
    var filename = req.files.files.originalFilename || path.basename(req.files.files.ws.path);
    //copy file to a public directory
    var targetPath = path.dirname(__filename) + '/public/' + filename;
    //copy file
    // fs.createReadStream(req.files.files.ws.path).pipe(fs.createWriteStream(targetPath));
    console.log(filename);
    console.log(targetPath);
    console.log(JSON.stringify(req.body));
    //   var newMusic = new Music({
    //     name: name,
    //     author: author,
    //     type: type,
    //     time: 0
    //   });

    //   //检查用户名是否已经存在
    //   Music.getByName(newMusic.name, function(err, music) {
    //     if (music) {
    //       msg = {
    //         state: false,
    //         info: "用户已存在"
    //       };
    //       return res.send(msg);
    //     }
    //     //如果不存在则新增用户
    //     newMusic.save(function(err, music) {
    //       if (err) {
    //         msg = {
    //           state: false,
    //           info: "请重试"
    //         }; //失败返回
    //         return res.send(msg);
    //       }
    //       console.log(music);
    //       msg = {
    //         state: true,
    //         info: "sussess"
    //       };
    //       return res.send(msg); //成功后返回
    //     });
    //   });
  });

  // app.get("/gameCenter", function(req, res) {
  //   res.render("gameCenter", {});
  // });

  // app.get("/jdInfo", function(req, res) {
  //   res.render("jdInfo", {});
  // });
};