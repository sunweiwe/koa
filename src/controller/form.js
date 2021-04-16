const { sequelize } = require('../model/index.js');
const auth = require('../utils/auth');

class FormController {
  /**
   * form list
   * @param {*} ctx
   */
  async findAll(ctx) {
    const token = ctx.header.authorization;

    const decryptToken = auth.decrypt(token);

    const user = await await sequelize.models.User.findOne({
      where: {
        phone: decryptToken.data.phone,
      },
    });

    const forms = await sequelize.models.Form.findAll({
      where: {
        createBy: user.id,
      },
    });

    ctx.response.status = 200;
    const session = ctx.session;

    ctx.body = {
      status: 200,
      data: forms,
      token: session[decryptToken.data.name],
      message: '查询成功',
    };

    return forms;
  }

  /**
   *
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.verifyParams({
      title: {
        type: 'string',
        required: true,
      },
    });

    const token = ctx.header.authorization;
    const decryptToken = auth.decrypt(token);

    const user = await await sequelize.models.User.findOne({
      where: {
        phone: decryptToken.data.phone,
      },
    });

    const form = ctx.request.body;
    const result = await sequelize.models.Form.create({ ...form, createBy: user.id });

    ctx.body = {
      form: result,
      code: 200,
      message: '创建成功！',
    };
  }

  async update(ctx) {
    ctx.verifyParams({
      id: {
        type: 'string',
        required: true,
      },
    });

    const { id = '' } = ctx.params;

    const token = ctx.header.authorization;
    const decryptToken = auth.decrypt(token);

    const user = await await sequelize.models.User.findOne({
      where: {
        phone: decryptToken.data.phone,
      },
    });

    const form = ctx.request.body;

    await sequelize.models.Form.update(
      { ...form, modifyBy: user.id },
      {
        where: {
          id,
        },
      },
    );

    ctx.body = {
      form,
      code: 200,
      message: '修改成功！',
    };
  }

  async destroy(ctx) {
    ctx.verifyParams({
      id: {
        type: 'string',
        required: true,
      },
    });

    const { id = '' } = ctx.params;

    const form = await sequelize.models.Form.findOne({
      where: {
        id,
      },
    });

    if (!form) {
      ctx.throw(404, '资源不存在！');
    }

    await sequelize.models.Form.destroy({
      where: {
        id,
      },
    });

    ctx.body = {
      form,
      code: 200,
      message: '删除',
    };
  }
}

module.exports = new FormController();
