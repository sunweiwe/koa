const jwt = require('jsonwebtoken');
const { secret } = require('../config/index.js');

const Token = {
  //  生成
  encrypt: function (data, time) {
    //data加密数据 ，time过期时间  60 * 30  （30分）
    return jwt.sign(data, secret, { expiresIn: time });
  },
  // 解析
  decrypt: function (token) {
    try {
      const formateToken = token.split(' ')[1];
      let data = jwt.verify(formateToken, secret);
      return {
        token: true,
        data,
      };
    } catch (e) {
      return {
        token: false,
        data: e,
      };
    }
  },
};
module.exports = Token;
