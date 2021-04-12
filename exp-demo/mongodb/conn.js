const mongoose = require('mongoose');
const hostname = '0.0.0.0';
const port = 27017;
const dbname = 'nz1903';
const user = "pjj"
const pwd = "pjj123456"

const conn_db_url = `mongodb://${user}:${pwd}@${hostname}:${port}/${dbname}`;
let {
    User
} = require('./schema');
mongoose.connect(conn_db_url, err => {
    if (err) {
        console.log('数据库连接错误');
    } else {
        console.log('数据库连接成功');
    }
});

const connection = mongoose.connection;
connection.on('connected', () => {
    console.log('连接成功');
})
connection.on('error', err => {
    console.log('连接错误--' + err);
})
connection.on('disconnected', () => {
    console.log('连接断开')
})
module.exports = connection;

/* User.insertMany([
    {
        username: 'wangchunyue'
    }
]).then(result => {
    console.log(result);
}).catch(err => {
    throw err;
}) */

/* User.updateMany({
    username: 'wangchunyue'
}, {
    $set: {
        age: 21,
        password: '123456'
    }
}).then(result => {
    console.log(result);
}).catch(err => {
    throw err;
}) */

/* User.remove({
    username: 'wangchunyue'
}).then(result => {
    console.log(result);
}).catch(err => {
    throw err;
}) */