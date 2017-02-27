var path = require("path");
var fs = require("fs");
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
  console.log(captchaText);
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

  // app.get("/gameCenter", function(req, res) {
  //   res.render("gameCenter", {});
  // });

  // app.get("/jdInfo", function(req, res) {
  //   res.render("jdInfo", {});
  // });
};
