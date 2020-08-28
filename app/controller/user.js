const UserModel = require("../model/user");

class UserController {
  // 查找用户
  async find(ctx) {
    const data = await UserModel.findAll();
    ctx.body = data;
  }

  async findById(ctx) {
    let id = Number(ctx.params.id);
    const data = await UserModel.findAll({
      where: {
        id,
      },
    });
    if (!data.length) {
      ctx.throw(404, "用户不存在！");
    }
    ctx.body = data[0];
  }

  async createUser(ctx) {
    ctx.verifyParams({
      username: { type: "string", required: true },
      password: { type: "string", required: true },
      role: { type: "number", required: true },
      email: { type: "string", required: false },
    });

    const user = await UserModel.create(ctx.request.body);
    ctx.body = user;
    console.log(user);
  }

  static async getUserList(ctx) {
    const { page = 1, pageSize = 10, username } = ctx.query;
    const where = {
      role: {
        $not: 1,
      },
    };
    if (username) {
      where.username = {};
      where.username["$like"] = `%${username}%`;
    }
    const result = await UserModel.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
      row: true,
      order: [["createdAt", "DESC"]],
    });

    ctx.body = result;
  }
}
module.exports = new UserController();
