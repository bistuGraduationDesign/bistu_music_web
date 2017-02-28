var path = require("path");
var fs = require("fs");
var crypto = require('crypto');
//captcha
var ccap = require('ccap');

var settings = require("../settings");
var User = require("../models/user");

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
  console.log("changeVerCode："+req.session.verCode);
  res.end(captchaBuffer);
}

function checkVerCode(req, res) {
  if (req.session.verCode) {
    console.log(req.query.verCode);
    if (req.query.verCode == req.session.verCode) {
      res.jsonp({
        result: true,
        reason: '验证正确'
      });
    } else {
      res.jsonp({
        result: false,
        reason: '验证码错误'
      });
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
  app.use('/verificationCode', function(req, res) {
    changeVerCode(req, res);
  });
  app.use('/goVerification', function(req, res) {
    checkVerCode(req, res);
  });


  app.post('/signin', function(req, res) {
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    //console.log(req.body.name);

    //检查verCode是否一致
    console.log(JSON.stringify(req.session));
    console.log(req.session.verCode);
    console.log(req.body.verCode);
    if (req.session.verCode != req.body.verCode) {
      return res.render('signin', {
      err: "verCode错误"
    });
      // res.json({
      //   err: "verCode错误"
      // }); //密码错误则跳转到登录页
    }
    User.get(req.body.name, function(err, user) {
      if (!user) {
        return res.json({
          err: "用户不存在"
        }); //用户不存在则跳转到登录页
      }
      //检查密码是否一致
      if (user.password != password) {
        return res.json({
          err: "密码错误"
        }); //密码错误则跳转到登录页
      }

      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      return res.json({
        sussess: "1"
      });
      // res.redirect('/');//登陆成功后跳转到主页
    });
  });

  app.post('/reg', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password_re = req.body['passwordrepeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      console.log("in");
      return res.json({
        err: "两次输入的密码是不一致"
      });
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
        return res.json({
          err: "用户已存在"
        });
      }
      //如果不存在则新增用户
      newUser.save(function(err, user) {
        if (err) {
          req.flash('error', err);
          return res.json({
            err: "请重试"
          }); //注册失败返回主册页
        }
        console.log(user);
        // req.session.user = user; //用户信息存入 session
        return res.json({
          sussess: "1"
        }); //注册成功后返回主页
      });
    });
  });
  app.get("/music", function(req, res) {
    res.render("music", {});
  });
  // app.get("/gameCenter", function(req, res) {
  //   res.render("gameCenter", {});
  // });

  // app.get("/jdInfo", function(req, res) {
  //   res.render("jdInfo", {});
  // });
};