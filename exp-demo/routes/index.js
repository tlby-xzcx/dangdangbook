var express = require('express');
var router = express.Router();
var {
  User,
  Mv
} = require('../mongodb/schema');
var {
  checkSession,
  dateFormat
} = require('../utils/fun');
//根据路由路径加载对应的路由数据

/* GET home page. */
//req 请求信息
//res 响应数据 res.send res.render res.json res.redirect
//next 进入下一个中间件
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Movie' });
});

router.get('/home', (req, res) => {
  res.render('home', { username: req.session.username });
})
router.get('/login', (req, res) => {
  var username = req.query.username || '';
  res.render('login', { username: username });//views/login.ejs文件
})
router.get('/register', (req, res) => {
  res.render('register.ejs');
})

router.get('/loginout', (req, res) => {
  //销毁req.session
  req.session.destroy(() => {
    res.redirect('/home');
  })
})

router.get('/movie', (req, res) => {
  let query = req.query;
  console.log(query);
  let searchObj = {};
  let sortObj = {};
  if (query['keyword']) {
    let keyword = query['keyword'];
    searchObj = {
      $or: [
        { title: new RegExp(keyword) },
        { year: new RegExp(keyword) },
        { genres: new RegExp(keyword) }//电影类别
      ]
    }
  } else {
    sortObj = query;
  }
  if (req.session.username) {
    Mv.find(searchObj, { _id: 0 }).sort(sortObj)
      .then(result => {
        res.render('movie', { result });
      })
  } else {
    res.send(`<script>alert('登录已失效，请重新登录！');location.href='/login';</script>`)
  }

});

router.get('/my', (req, res) => {
  if (req.session.username) {
    User.findOne({
      username: req.session.username
    }).then(result => {
      res.render('my', { result });
    })
  } else {
    res.send(`<script>alert('登录已失效，请重新登录！');location.href='/login';</script>`)
  }
});

router.get('/resetpwd', (req, res) => {
  res.render('resetpwd');
});

router.get('/chatroom', (req, res) => {
  checkSession(req, res, () => {
    let username = req.session.username;
    console.log(username);
    res.render('webSocket', { username });
  })

})
module.exports = router;
