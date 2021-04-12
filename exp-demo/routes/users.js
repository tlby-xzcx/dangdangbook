var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

let {
  User
} = require('../mongodb/schema.js');
router.post('/register', (req, res) => {
  let body = req.body;//req.body获取post提交的formData
  // console.log(body);
  User.findOne({
    username: body.username
  }).then(result => {
    // console.log(result);
    if (result) {
      res.send(`<script>alert('用户名已存在，请重新填写');location.href='/register';</script>`)
    } else {
      User.insertMany(body).then(data => {
        res.send(`<script>alert('正在跳转登录...');location.href='/login?username=${body.username}'</script>`)
      })
    }
  })
  // User.insertMany([
  //   {
  //     username: body.username,
  //     password: body.password,
  //     repass: body.repass
  //   }
  // ])
  // res.send('注册成功...');
});

router.post('/login', (req, res) => {
  console.log(req.body);
  var body = req.body;
  User.findOne({
    username: body.username
  }).then(result => {
    if (result) {
      if (result.password === body.password) {
        req.session.username = body.username;
        res.redirect('/home');
      } else {
        res.send(`<script>alert("用户名或密码输入错误，请重新登录");location.href='/login'</script>`);
      }
    } else {
      res.send(`<script>alert("用户名或密码输入错误，请重新登录");location.href='/login';</script>`);
    }
  })
});

router.post('/changeinfo', (req, res) => {
  var body = req.body;
  console.log(body);
  if (req.session.username) {
    User.updateMany({
      username: req.session.username
    }, {
      $set: body
    }).then(result => {
      res.json({
        msg: '信息修改成功',
        result,
        code: 200
      });
    })
  } else {
    res.send(`<script>alert('登录已过期，请重新登录');location.href='/login'</script>`)
  }
});

router.post('/confirmreset', (req, res) => {
  var body = req.body;
  if (req.session.username) {
    User.findOne({
      username: req.session.username
    }).then(result => {
      if (result.password === body.oldpassword) {
        User.updateMany({
          username: req.session.username
        }, {
          $set: {
            password: body.newpassword
          }
        }).then(result => {
          res.json({
            msg: '密码重置成功',
            code: 200,
            type: 1
          })
        })
      } else {
        res.json({
          msg: '旧密码输入有误',
          code: 200,
          type: 0
        })
      }
    })
  } else {
    res.send(`<script>alert('登录已过期，请重新登录');location.href='/login'</script>`)

  }
})
module.exports = router;
