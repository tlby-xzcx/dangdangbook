const crypto = require("crypto");   // Node 自带API 

// MD5 只能加密不能解密 ，不可逆
// 加密函数  data 需要加密的字段 
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;  // 密文  
}

// 解密 
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;  // 明文 
}

const keys = "NZ1903daydayup";   //   zklabc ==>  NZ1903daydayupzklabc

exports.aesEncrypt = aesEncrypt;   // 加密
exports.aesDecrypt = aesDecrypt;   // 解密
exports.keys = keys;        // 密钥 


exports.checkSession = function (req, res, callback) {
    if (req.session.username) {
        callback()
    } else {
        res.send(`<script>alert('登录已失效，请重新登录！');location.href='/login';</script>`);
    }
}
exports.dateFormat = function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}