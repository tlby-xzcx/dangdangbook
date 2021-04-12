var express = require('express');
var router = express.Router();

var {
    checkSession,
    dateFormat
} = require('../utils/fun');
var {
    Mv,
    Comment,
    Uid
} = require('../mongodb/schema')
router.get('/', (req, res) => {
    res.send('this is my movie comment router module...');
});

router.get('/index', (req, res) => {
    var query = req.query;//{ mid: '1292052' }
    console.log(query);
    checkSession(req, res, () => {
        Mv.findOne({
            id: query.mid
        }).then(result => {
            res.render('comment', { result });
        })
    })
    // res.render('comment');
});

router.post('/submit', (req, res) => {
    var body = req.body;
    var query = req.query;
    //console.log(query, body);
    checkSession(req, res, () => {
        //查询电影详情
        //获取自增长的id，记录评论条数？
        //插入数据
        if (body.title !== '' && body.content !== '') {
            Mv.findOne({ id: query.mid }).then(movie => {
                //根据id查询是哪一部电影
                Uid.updateMany({
                    name: 'comments'
                }, {
                    $inc: {
                        id: 1//让评论数加一
                    }
                }).then(obj => {
                    body.time = new Date().toLocaleString();
                    body.id = obj.id;
                    body.username = req.session.username;
                    body.mid = movie.id;
                    body.mtitle = movie.title;
                    body.mimg = movie.images.large;
                    Comment.insertMany(body).then(result => {
                        console.log(result);//[{id:}]
                        Comment.find({
                            mid: movie.id
                        }).sort({ _id: -1 }).then(result => {
                            console.log(result);
                            res.render('commentlist', { result });
                        })
                    })
                })
            })
        } else {
            res.send('标题和内容不能为空')
        }

    })
});

router.get('/commentlist', (req, res) => {
    var query = req.query;
    checkSession(req, res, () => {
        Comment.find({
            mid: query.mid
        }).sort({ _id: -1 }).then(result => {
            console.log(result);
            res.render('commentlist', { result });
        })
    })
})

router.get('/allcomment', (req, res) => {
    let query = req.query;
    let pageNow = query.pageNow * 1 || 1;//当前页码
    console.log(pageNow);
    let total = 0;//总条数
    let pageSize = query.pageSize * 1 || 4;//每页显示的条数
    let totalPage = 0;//总页数

    checkSession(req, res, () => {
        Comment.find({
            username: req.session.username
        }).sort({ _id: -1 })
            .then(result => {
                if (result.length > 0) {
                    total = result.length;
                    totalPage = Math.ceil(total / pageSize);
                    pageNow = pageNow < 1 ? 1 : pageNow;
                    if (pageNow >= totalPage) {
                        pageNow = totalPage;
                    }
                    // pageNow = pageNow >= totalPage ? totalPage : pageNow;
                }
                Comment.find({
                    username: req.session.username
                }).sort({ _id: -1 })
                    .skip((pageNow - 1) * pageSize)
                    .limit(pageSize)
                    .then(allcom => {
                        res.render('allcomment', {
                            allcom,
                            username: req.session.username,
                            total,
                            totalPage,
                            pageSize,
                            pageNow
                        })
                    })
            });

    })

    // checkSession(req, res, () => {
    //     Comment.find({
    //         username: req.session.username
    //     }).sort({ _id: -1 }).then(allcom => {
    //         console.log(allcom);
    //         res.render('allcomment', { allcom });
    //     })
    // })
});

router.get('/delete', (req, res) => {
    let comid = req.query;
    console.log(comid);
    checkSession(req, res, () => {
        Comment.deleteMany({
            _id: comid
        }).then(result => {
            res.json({
                result,
                code: 200,
                msg: '该条评论删除成功',
                type: 1
            })
        })
        res.send('删除成功')
    })
})

router.post('/update', (req, res) => {
    let body = req.body;
    console.log(body);
    Comment.updateMany({
        _id: body._id
    }, {
        $set: {
            title: body.title,
            content: body.content
        }
    }).then(result => {
        res.json({
            code: 200,
            msg: '修改成功',
            type: 1,
            result
        })
    })
    // res.send('修改成功');
})
module.exports = router;