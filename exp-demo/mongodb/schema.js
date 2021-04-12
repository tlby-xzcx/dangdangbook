const mongoose = require('mongoose');
const schema = mongoose.Schema;
const user_schema = new schema({
    username: String,
    password: String,
    repass: String,
    nickname: String,
    email: String,
    avatar: String,
    mobile: String,
    type: Number,
    isstart: Boolean
});
exports.User = mongoose.model('user', user_schema);

const mv_schema = new schema({
    "rating": Object,
    "genres": Array,
    "title": String,
    "casts": Array,
    "collect_count": Number,
    "original_title": String,
    "subtype": String,
    "directors": Array,
    "year": String,
    "images": Object,
    "alt": String,
    "id": String
});
exports.Mv = mongoose.model('mv', mv_schema);

const comment_schema = new schema({
    id: Number,
    title: String,
    content: String,
    username: String,
    time: String,
    mid: String,
    mtitle: String,
    mimg: String
});
exports.Comment = mongoose.model('comment', comment_schema);


const uid_schema = new schema({
    id: Number,
    name: String//表名
})
exports.Uid = mongoose.model('uid', uid_schema);

const liuyan_schema = new schema({
    id: Number,
    title: String,
    content: String
})
exports.Liuyan = mongoose.model('liuyan', liuyan_schema);

//草稿箱表结构
const draft_schema = new schema({
    id: Number,
    mobile: String,
    email: String,
    title: String,
    content: String,
    time: String,
    toggle: Boolean,
    redflag: String
})
exports.Draft = mongoose.model('draft', draft_schema);

const advise_schema = new schema({
    id: Number,
    mobile: String,
    title: String,
    content: String,
    category: Array
})
exports.Advise = mongoose.model('advise', advise_schema);


const goods_schema = new schema({
    name: String,
    price: Number,
    img: String,
    rate: Number,
    author: String,
    type: Object
})
exports.Goods = mongoose.model('good', goods_schema);


const carts_schema = new schema({
    mobile: String,
    count: Number,
    goodid: String,
    good: Object,//整个商品信息
    time: String,
    name: String,
    price: Number,
    img: String,
    type: Object,
    ischecked: Boolean,
    rate: Number,
    author: String,
})
exports.Carts = mongoose.model('cart', carts_schema);