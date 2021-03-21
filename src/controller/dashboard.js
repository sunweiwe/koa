const { sequelize } = require('../model/index.js');
const auth = require('../util/auth');

class DashBoardController {
  /**
   * dashboard list
   * @param {*} ctx
   */
  async find(ctx) {
    const token = ctx.header.authorization;

    const decryptToken = auth.decrypt(token);
    const dashboards = await sequelize.models.Dashboards.findAll();

    ctx.response.status = 200;
    const session = ctx.session;

    ctx.body = {
      status: 200,
      data: dashboards,
      token: session[decryptToken.data.name],
      message: '查询成功',
    };

    return dashboards;
  }
}

module.exports = new DashBoardController();
