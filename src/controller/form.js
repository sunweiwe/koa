const { sequelize } = require('../model/index.js');
const auth = require('../utils/auth');

class FormController {
  /**
   * form list
   * @param {*} ctx
   */
  async find(ctx) {
    const token = ctx.header.authorization;

    const decryptToken = auth.decrypt(token);
    const forms = await sequelize.models.Form.findAll();

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
}

module.exports = new FormController();
