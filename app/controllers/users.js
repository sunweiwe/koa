const { sequelize } = require('../../models/index.js');

const jsonwebtoken = require('jsonwebtoken');

const { secret } = require('../../config');

class UsersController {
  async find(ctx) {
    const users = await sequelize.models.User.findAll();
    ctx.body = users;
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter(f => f)
      .map(f => ' +' + f)
      .join('');
    const populatedStr = fields
      .split(';')
      .filter(f => f)
      .map(f => {
        if (f === 'employments') {
          return 'employments.company employments.job';
        }
        if (f === 'educations') {
          return 'educations.school educations.major';
        }
        return f;
      })
      .join(' ');
    const user = await await User.findById(ctx.params.id)
      .select(selectFields)
      .populate(populatedStr);

    if (!user) {
      ctx.throw(404, '用户不存在！');
    }
    ctx.body = user;
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
    });
    const { name } = ctx.request.body;
    const repeatUser = await User.findOne({ name });
    if (repeatUser) {
      ctx.throw(409, '用户已经存在！');
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
    });

    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, '用户不存在！');
    }
    ctx.body = user;
  }

  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, '用户不存在！');
    }
    ctx.status = 204;
  }

  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    });

    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, '用户名或者密码不正确！');
    }
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, '123', { expiresIn: '1d' });
    ctx.body = { token };
  }
}

module.exports = new UsersController();
