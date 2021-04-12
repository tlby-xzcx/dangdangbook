
var cors = require('cors');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var commentRouter = require('./routes/comment');
var vueRouter = require('./routes/vue');
var reactRouter = require('./routes/react');

//连接数据库
var connection = require('./mongodb/conn')

require('./utils/webSocketServer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var session = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors());
app.use('/vue', vueRouter);
app.use('/react', reactRouter);
app.use(session({
  name: 'AppTest',
  cookie: { maxAge: 1000 * 60 * 60 },//保存最长时间
  secret: 'test',
  resave: false,
  saveUninitialized: true
}))
app.use('/comment', commentRouter);
//设置路由中间件 app.use('路由别名',路由模块)
//路由正确执行成功不会进入到下一个中间件
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
