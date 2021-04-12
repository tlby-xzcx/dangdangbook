var express = require('express');
var router = express.Router();
var {
    Liuyan,
    User,
    Draft,
    Advise,
    Goods,
    Carts
} = require('../mongodb/schema');
var {
    createToken
} = require('../utils/token')
router.get('/index', (req, res) => {
    res.json({
        code: 200,
        msg: '测试接口'
    })
})

router.get('/getliuyan', (req, res) => {
    Liuyan.find({}, {}).then(result => {
        res.json({
            code: 200,
            msg: '获取留言成功',
            result
        })
    })
})

router.post('/addliuyan', (req, res) => {
    var body = req.body;
    Liuyan.insertMany(body).then(data => {
        Liuyan.find({}, {}).then(result => {
            res.json({
                code: 200,
                msg: '评论添加成功',
                result,
                type: 1
            })
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '评论添加失败',
            err,
            type: 0
        })
    })
})

router.post('/delliuyan', (req, res) => {
    var {
        delId
    } = req.body;
    Liuyan.deleteMany({
        _id: delId
    }).then(result => {
        res.json({
            code: 200,
            msg: '评论删除成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '评论删除失败',
            err,
            type: 0
        })
    })
})

router.post('/register', (req, res) => {
    var body = req.body;
    User.findOne({
        mobile: body.mobile
    }).then(data => {
        if (data) {
            res.json({
                code: 200,
                msg: '注册失败，已存在',
                result: null,
                type: 0
            })
        } else {
            body.time = new Date();
            body.type = 0;//默认为普通用户
            body.isstart = true;//默认启动
            User.insertMany(body).then(result => {
                res.json({
                    code: 200,
                    msg: '注册成功',
                    result,
                    type: 1
                })
            })
        }
    })
})

router.post('/login', (req, res) => {
    var body = req.body;
    User.findOne({
        mobile: body.mobile
    }).then(result => {
        // console.log(result.isstart)
        // console.log(body.mobile)
        // console.log(body.type)
        // console.log(result.type)
        if (result) {
            if (result.isstart && (body.type == result.type)) {
                if (result.password == body.password) {
                    result.type = body.type;
                    const token = createToken(result.mobile)
                    res.json({
                        code: 200,
                        msg: '登录成功',
                        type: 1,
                        result,
                        token
                    })
                } else {
                    res.json({
                        code: 200,
                        msg: '登录失败，手机号或者密码输入不正确',
                        type: 0,
                        result
                    })
                }
            } else {
                res.json({
                    code: 200,
                    msg: '登录失败，已禁用或权限错误',
                    type: 0,
                    result
                })
            }
        }
    })
})

router.post('/draftsubmit', (req, res) => {
    var body = req.body;
    // console.log(body);
    body.time = new Date();
    body.content = body.user.introduction;
    // console.log(body.content)
    Draft.insertMany(body).then(result => {
        console.log(result);
        res.json({
            msg: '邮件添加成功',
            code: 200,
            result
        })
    })
})

//查询已发送
router.post('/hasbeen', (req, res) => {
    var body = req.body;
    Draft.find({
        mobile: body.mobile
    }).sort({ _id: -1 }).then(result => {
        res.json({
            msg: '邮件查询成功',
            code: 200,
            result
        })
    })
})

//删除已发送邮件
router.post('/delhasbeensent', (req, res) => {
    var { delId } = req.body;
    Draft.deleteMany({
        _id: delId
    }).then(result => {
        res.json({
            code: 200,
            msg: '删除成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '删除失败',
            err,
            type: 0
        })
    })
})

//修改草稿箱里的标题和内容
router.post('/updatehasbeensent', (req, res) => {
    var {
        uid,
        title,
        content
    } = req.body
    Draft.updateMany({
        _id: uid
    }, {
        $set: {
            title,
            content
        }
    }).then(result => {
        res.json({
            code: 200,
            msg: '修改成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '修改失败',
            err,
            type: 0
        })
    })
})
//查看所有用户
router.post('/checkalluser', (req, res) => {
    User.find({}, {}).sort({ _id: -1 }).then(result => {
        res.json({
            code: 200,
            msg: '用户查询成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '用户查询失败',
            err,
            type: 0
        })
    })
})

//添加用户
router.post('/adduser', (req, res) => {
    var body = req.body;
    User.findOne({
        mobile: body.mobile
    }).then(data => {
        if (data) {
            res.json({
                code: 200,
                msg: '用户添加失败,已存在',
                result: null,
                type: 0
            })
        } else {
            body.time = new Date();
            User.insertMany(body).then(result => {
                res.json({
                    code: 200,
                    msg: '用户添加成功',
                    result,
                    type: 1
                })
            })
        }
    })
})
//删除用户
router.post('/deluser', (req, res) => {
    var { delId } = req.body;
    User.deleteMany({
        _id: delId
    }).then(result => {
        console.log(result);
        res.json({
            code: 200,
            msg: '删除成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '删除失败',
            err,
            type: 0
        })
    })
})
//修改用户权限和是否启动
router.post('/updateuser', (req, res) => {
    var {
        updateId,
        isstart,
        type
    } = req.body

    User.updateMany({
        _id: updateId
    }, {
        $set: {
            isstart,
            type
        }
    }).then(result => {
        res.json({
            code: 200,
            msg: '修改成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '修改失败',
            err,
            type: 0
        })
    })
})

//查找一个用户
router.post('/checkoneuser', (req, res) => {
    var body = req.body;
    User.find({
        mobile: body.mobile
    }).sort({ _id: -1 }).then(result => {
        res.json({
            msg: '查询用户成功',
            code: 200,
            result
        })
    })
})

router.post('/getalladvise', (req, res) => {
    var body = req.body;
    Advise.find(body).sort({ _id: -1 }).then(result => {
        res.json({
            code: 200,
            msg: '意见获取成功',
            result,
            type: 1
        })
    })
})

router.post('/insertadvise', (req, res) => {
    var body = req.body;
    // console.log(body)
    Advise.insertMany(body).then(result => {
        res.json({
            code: 200,
            msg: '插入意见成功',
            type: 1,
            result
        })
    })
})
router.post('/deladvise', (req, res) => {
    var { delId } = req.body;
    Advise.deleteMany({
        _id: delId
    }).then(result => {
        console.log(result);
        res.json({
            code: 200,
            msg: '删除意见成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '删除意见失败',
            err,
            type: 0
        })
    })
})

router.post('/lookadvise', (req, res) => {
    var body = req.body;
    Advise.find({
        _id: body.lookId
    }).then(result => {
        res.json({
            msg: '查询用户成功',
            code: 200,
            result
        })
    })
})

//更改用户信息
router.post('/updateuserinfo', (req, res) => {
    var body = req.body;
    console.log(body);
    User.updateOne({
        mobile: body.mobile
    }, {
        $set: {
            username: body.username,
            email: body.email
        }
    }).then(data => {
        User.findOne({ mobile: body.mobile }).then(result => {
            res.json({
                code: 200,
                msg: '个人信息修改成功',
                type: 1,
                result
            })
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '个人信息修改失败',
            type: 0,
        })
    })
})

//获取一个用户


router.post('/sendemail', (req, res) => {
    var body = req.body;
    console.log(body);
    let to = body.email;
    let subject = body.title;
    let from = body.from;
    let html = body.user.introduction;
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'qq',
        auth: {
            user: '1940200164@qq.com',
            pass: 'nxpwwbmiblvbcgfb' //授权码,通过QQ获取

        }
    });
    if (to && subject && html && from) {
        var mailOptions = {
            from: '1940200164@qq.com',// 发送者
            // 1361982681@qq.com,
            to, // 接受者,可以同时发送多个,以逗号隔开
            subject, // 标题
            //text: 'Hello world', // 文本
            html,
            // attachments: [
            //     {
            //         filename: 'package.json',
            //         path: './package.json'
            //     },
            //     {
            //         filename: 'content',
            //         content: '发送内容'
            //     }
            // ]
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                return;
            } else {
                body.time = new Date();
                body.content = body.user.introduction;
                Draft.insertMany(body).then(result => {
                    console.log(result);
                    res.json({
                        msg: '邮件添加成功',
                        code: 200,
                        result
                    })
                })
                res.json({
                    msg: '发送成功',
                    code: 200,
                    type: 1
                })
            }
        });
    } else {
        res.json({
            msg: '信息未填完整',
            code: 200,
            type: 0
        })
    }
})

//修改红旗
router.post('/updateredflag', (req, res) => {
    let body = req.body;
    Draft.updateMany({
        _id: body._id
    }, {
        $set: {
            redflag: body.redflag
        }
    }).then(data => {
        Draft.findOne({ _id: body._id }).then(result => {
            res.json({
                code: 200,
                msg: '修改成功',
                result,
                type: 1
            })
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '修改失败',
            err,
            type: 0
        })
    })
})

router.post("/findGoodList", (req, res) => {
    // getMobile(req,res,mobile=>{
    var limit = req.body.limit || 0;
    Goods.find({

    }, {}).limit(limit).sort({ _id: -1 }).then(result => {
        res.json({
            code: 200,
            type: 1,
            msg: "查询成功",
            result
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: "查询失败",
            type: 0
        })
    })
})
// })


// 获取商品分类 
router.post("/findGoodType", (req, res) => {
    // getMobile(req,res,mobile=>{
    var limit = req.body.limit || 0;
    Goods.distinct("type").then(result => {
        res.json({
            code: 200,
            type: 1,
            msg: "查询成功",
            result
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: "查询失败",
            type: 0
        })
    })
    // })
})

//加入购物车
router.post('/addshopcart', (req, res) => {
    var body = req.body;
    // console.log(body);
    //表示count不存在
    // Carts.update({ "count": { "$exists": false } }, { $set: { count: 1 } })

    Carts.findOne({
        mobile: body.mobile,
        goodid: body._id//判断一件商品
    }).then(data => {
        if (data) {
            //有商品记录，加
            Carts.updateMany({
                mobile: body.mobile,
                goodid: body._id
            }, {
                $inc: {
                    count: 1
                }
            }).then(result => {
                // Carts.findOne({ _id: body._id }).then(result => {
                res.json({
                    code: 200,
                    type: 1,
                    msg: "添加购物车成功",
                    result
                })
            })
            // })
        } else {
            //没有商品记录，新增
            // body.good = body;
            body.time = new Date().toLocaleString();
            body.goodid = body._id;
            // console.log(body);
            body.count = 1;
            Carts.insertMany({
                ...body
            }).then(result => {
                // Carts.findOne({ _id: body._id }).then(result => {
                // console.log(body._id);
                res.json({
                    code: 200,
                    type: 1,
                    msg: "新增购物车成功",
                    result
                })
                // })
            })
        }
    })
})

//查询商品
router.post('/findshopcart', (req, res) => {
    var mobile = req.body.mobile;
    Carts.find({ mobile }, {}).then(result => {
        res.json({
            code: 200,
            type: 1,
            msg: "购物车查询成功",
            result
        })
    })
})


//删除购物车里的一条数据
router.post('/delshopcarone', (req, res) => {
    var {
        _id,
        mobile
    } = req.body
    Carts.deleteMany({
        _id, mobile
    }).then(result => {
        res.json({
            code: 200,
            msg: '商品删除成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '商品删除失败',
            err,
            type: 0
        })
    })
})

//修改选中
router.post('/changeonecheck', (req, res) => {
    var {
        _id,
        mobile,
        ischecked
    } = req.body;
    Carts.updateMany({
        _id, mobile
    }, {
        $set: {
            ischecked
        }
    }).then(result => {
        res.json({
            code: 200,
            msg: '修改选中成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '修改选中失败',
            type: 0
        })
    })
})


router.post('/getdraftbyredflag', (req, res) => {
    Draft.find({ redflag: '1' }, {}).then(result => {
        res.json({
            code: 200,
            msg: '红旗邮件查询成功',
            result,
            type: 1
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '红旗邮件查询失败',
            type: 0
        })

    })
})


router.post('/cancelredflag', (req, res) => {
    var _id = req.body._id;
    Draft.updateOne({
        _id
    }, {
        $set: {
            redflag: null
        }
    }).then(data => {
        Draft.find({ redflag: '1' }).then(result => {
            res.json({
                code: 200,
                msg: '红旗邮件修改成功',
                type: 1,
                result
            })
        })
    }).catch(err => {
        res.json({
            code: 200,
            msg: '红旗邮件修改失败',
            type: 0,
        })
    })
})

module.exports = router;