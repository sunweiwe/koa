const { sequelize } = require('../model/index.js');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/index.js');

class UserController {
  /**
   *
   * @param {*} ctx
   */
  async find(ctx) {
    const users = await sequelize.models.User.findAll();
    ctx.response.status = 200;

    ctx.body = {
      status: 200,
      users: users,
      message: '查询成功',
    };
  }

  /**
   *
   * @param {*} ctx
   */
  async findById(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    });

    const { id = '' } = ctx.params;

    const user = await await sequelize.models.User.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      ctx.throw(404, '用户不存在！');
    }
    ctx.body = {
      user: user,
      code: 200,
      message: '查询成功！',
    };
  }

  /**
   *
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.verifyParams({
      phone: {
        type: 'string',
        required: true,
      },
    });

    const user = ctx.request.body;
    const repeatUser = await sequelize.models.User.findOne({
      where: {
        phone: user.phone,
      },
    });
    if (repeatUser) {
      ctx.throw(409, '用户已经存在！');
    }
    await sequelize.models.User.create(user);

    ctx.body = user;
  }

  /**
   *
   * @param {*} ctx
   */
  async update(ctx) {
    const user = ctx.request.body;

    const repeatUser = await sequelize.models.User.findOne({
      where: {
        id: user.id,
      },
    });
    if (!repeatUser) {
      ctx.throw(404, '用户不存在！');
    }
    await sequelize.models.User.update(user, {
      where: {
        id: user.id,
      },
    });
    ctx.body = user;
  }

  /**
   *
   * @param {*} ctx
   */
  async deleteUser(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      phone: {
        type: 'string',
        required: true,
      },
    });
    const user = ctx.request.body;

    await sequelize.models.User.destroy({
      where: {
        id: user.id,
      },
    });

    ctx.status = 204;
  }
  /**
   *
   * @param {*} ctx
   */
  async login(ctx) {
    ctx.verifyParams({
      password: { type: 'string', required: true },
      phone: { type: 'string', required: true },
    });
    const user = ctx.request.body;

    const { dataValues } = await sequelize.models.User.findOne({
      where: {
        phone: user.phone,
      },
    });

    if (dataValues.password !== user.password) {
      ctx.throw(500, '密码错误！');
    }

    if (!dataValues) {
      ctx.throw(404, '用户不存在！');
    }

    let userToken = {
      phone: user.phone,
    };
    const token = jwt.sign(userToken, secret, { expiresIn: '7d' }); //token签名 有效期为1小时
    const session = ctx.session;
    session[user.phone] = token;
    ctx.body = {
      message: '获取token成功',
      code: 200,
      data: {
        ...dataValues,
      },
      token,
    };
  }
}

module.exports = new UserController();
