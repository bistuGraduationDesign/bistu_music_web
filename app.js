var path = require("path");//文件路径
var fs = require("fs");//文件操作
var express = require("express");
var bodyParser = require('body-parser') 
var cookieParser = require("cookie-parser");//登陆历史
var MongoStore = require("connect-mongo")(express);

var routes = require("./routes/index");
var settings = require("./settings");

var app = express();

app.set("port", process.env.PORT || settings.serverPort);//端口确认

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));//网页静态文件

app.use(express.bodyParser());
// cookie
app.use(cookieParser());
app.use(express.session({//登陆时间
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {
    maxAge: settings.cookieAge
  },
  store: new MongoStore({
    url: "mongodb://" + settings.host + "/" + settings.db
  })
}));

routes(app);

var server = app.listen(app.get("port"), function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log(server.address());
  console.log("Example app listening at http://%s:%s", host, port);
});