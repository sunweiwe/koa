const { sequelize } = require('../models/index.js');

// const jsonwebtoken = require('jsonwebtoken');
// const { secret } = require('../config');

class DashBoardController {
  async find(ctx) {
    const dashboards = await sequelize.models.DashBoard.findAll();
    ctx.response.status = 200;

    ctx.body = {
      status: 200,
      users: dashboards,
      message: '查询成功',
    };
  }
}

module.exports = new DashBoardController();
