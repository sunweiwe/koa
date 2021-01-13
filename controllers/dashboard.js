const { sequelize } = require('../models/index.js');
const auth = require('../utils/auth');

class DashBoardController {
  /**
   * dashboard list
   * @param {*} ctx
   */
  async find(ctx) {
    const token = ctx.header.authorization;
    console.log(token);

    const decryptToken = auth.decrypt(token);
    console.log(decryptToken);
    const dashboards = await sequelize.models.Dashboards.findAll();

    ctx.response.status = 200;
    const session = ctx.session;

    ctx.body = {
      status: 200,
      data: dashboards,
      token: session[decryptToken.data.name],
      message: '查询成功',
    };
  }
}

module.exports = new DashBoardController();
