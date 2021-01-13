const { sequelize } = require('../models/index.js');
const jsonwebtoken = require('jsonwebtoken');
const { secret } = require('../config/index.js');

class UsersController {
  async find(ctx) {
    const users = await sequelize.models.Users.findAll();
    ctx.response.status = 200;

    ctx.body = {
      status: 200,
      users: users,
      message: '查询成功',
    };
  }

  async findById(ctx) {
    const { id = '' } = ctx.params;

    const user = await await sequelize.models.Users.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      ctx.throw(404, '用户不存在！');
    }
    ctx.body = {
      user: user,
    };
  }

  async create(ctx) {
    const user = ctx.request.body;
    const repeatUser = await sequelize.models.Users.findOne({
      where: {
        phone: user.phone,
      },
    });
    if (repeatUser) {
      ctx.throw(409, '用户已经存在！');
    }
    await sequelize.models.Users.create(user);

    ctx.body = user;
  }

  async update(ctx) {
    const user = ctx.request.body;

    const repeatUser = await sequelize.models.Users.findOne({
      where: {
        id: user.id,
      },
    });
    if (!repeatUser) {
      ctx.throw(404, '用户不存在！');
    }
    await sequelize.models.Users.update(user, {
      where: {
        id: user.id,
      },
    });
    ctx.body = user;
  }

  async deleteUser(ctx) {
    const user = ctx.request.body;

    await sequelize.models.Users.destroy({
      where: {
        id: user.id,
      },
    });

    ctx.status = 204;
  }

  async login(ctx) {
    const user = ctx.request.body;

    const repeatUser = await sequelize.models.Users.findOne({
      where: {
        phone: user.phone,
      },
    });

    if (!repeatUser) {
      ctx.throw(404, '用户不存在！');
    }

    if (user && user.phone) {
      let userToken = {
        phone: user.phone,
      };
      const token = jsonwebtoken.sign(userToken, secret, { expiresIn: '1h' }); //token签名 有效期为1小时
      const session = ctx.session;
      session[user.phone] = token;
      ctx.body = {
        message: '获取token成功',
        code: 1,
        token,
      };
    } else {
      ctx.body = {
        message: '参数错误',
        code: -1,
      };
    }
  }
}

module.exports = new UsersController();
