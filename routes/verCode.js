//captcha
var ccap = require("ccap"); //验证码
//captcha
var captcha = ccap({
  width: 256, //set width,default is 256
  height: 60, //set height,default is 60
  offset: 40, //set text spacing,default is 40
  quality: 600, //set pic quality,default is 50
  fontsize: 67, //set font size,default is 57
});

exports.changeVerCode = function(req, res) {
  var captchaArr = captcha.get(); //生成新的验证码
  var captchaText = captchaArr[0],
    captchaBuffer = captchaArr[1];
  req.session.verCode = captchaText;
  res.end(captchaBuffer);
}

exports.checkVerCode = function(req, res) {
  var msg;
  if (req.session.verCode) {
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