var express = require('express');
var router = express.Router();



var {
    User,
    Mv
} = require('../mongodb/schema')

var {
    aesEncrypt,
    aesDecrypt,
    keys
} = require("../utils/fun")

var multer = require('multer')

router.get('/', (req, res) => {
    res.send('测试')
});

router.get('/user', (req, res) => {
    User.find({}, { _id: 0 }).then(result => {
        res.json({
            msg: '用户信息传输成功',
            code: 200,
            result
        })
    })
});

// router.post('/register', (req, res) => {
//     let body = req.body;
//     res.json({
//         msg: '用户信息',
//         code: 200,
//         body
//     })
// })

router.get('/register2', (req, res) => {
    let body = req.body;
    res.json({
        msg: '用户信息',
        code: 200,
        body
    })
})

router.get('/movie', (req, res) => {
    let query = req.query;
    let limit = query.limit * 1;
    console.log(query);
    Mv.find({}, { _id: 0 }).limit(limit).then(result => {
        res.json({
            msg: '电影信息获取成功',
            code: 200,
            result
        })
    })
})

router.post('/login', (req, res) => {
    console.log(req.body);
    let body = req.body;
    User.findOne({
        username: body.username
    }).then(result => {
        if (result) {
            console.log(result.username)
            console.log(body.password)
            if (result.password == body.password) {
                var token = aesEncrypt(result.username + result.password, keys);
                // req.session.username = result.username;
                // req.session.password = result.password;
                // req.session.token = token;
                res.json({
                    msg: '登录成功',
                    code: 200,
                    result,
                    type: 1,
                    token//发送到客户端，经过了加密的token
                })
            } else {
                res.json({
                    msg: '用户名或密码错误，请核对后重新输入',
                    type: 0
                })
            }
        } else {
            res.json({
                msg: '用户名不存在',
                code: 201,
                result,
                type: 0
            })
        }
    })
});

router.post('/register', (req, res) => {
    let body = req.body;//req.body获取post提交的formData
    console.log(body);
    User.findOne({
        username: body.username
    }).then(result => {
        // console.log(result);
        if (result) {
            res.json({
                msg: '用户名已存在',
                type: 0
            })
        } else {
            User.insertMany(body).then(data => {
                console.log(data);
                res.json({
                    msg: '正在跳转...',
                    code: 200,
                    data,
                    type: 1
                })
            })
        }
    })
});

router.get('/getUserInfo', (req, res) => {
    User.findOne({
        username: req.session.username
    }).then(result => {
        res.json({
            msg: '获取用户信息成功',
            code: 200,
            result,
            type: 1
        })
    })
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload');//存放图片
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + 'nz' + file.originalname);//加上时间戳，避免冲突,originalname原始名称
    }
})

var upload = multer({ storage: storage }).any();//接收任何格式的文件
router.post('/uploadimg', upload, (req, res) => {
    console.log('文件上传成功')
    console.log(req.files);
    if (req.files) {
        var path = req.files[0].path;//图片的路径
        User.updateOne({
            username: req.session.username
        }, {
            $set: {
                avatar: path
            }
        }).then(res => {
            res.json({
                code: 200,
                msg: '头像上传成功',
                type: 1,
                path: path,
                username: req.session.username
            })
        })
        res.json({
            code: 200,
            msg: '头像上传成功',
            type: 1,
            path: path
        })
    } else {
        res.json({
            code: 200,
            msg: '头像上传失败',
            type: 0
        })
    }

})

module.exports = router;