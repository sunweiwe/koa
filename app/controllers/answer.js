const Answer = require("../models/questions");
const User = require("../models/users");

class AnswerController {
  async find(ctx) {
    const { page_size = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const pageSize = Math.max(page_size * 1, 1);
    const q = new RegExp(ctx.query.q);
    ctx.body = await Answer.find({
      content: q,
      questionId: ctx.params.questionId,
    })
      .limit(pageSize)
      .skip(page * pageSize);
  }

  async findById(ctx) {
    const { fields } = ctx.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const Answer = await Answer.findById(ctx.params.id)
      .select(selectFields)
      .populate("questioner topics");
    ctx.body = Answer;
  }

  async create(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: true },
    });
    const answerer = ctx.state.user._id;
    const { questionId } = ctx.params;
    const answer = await new Answer({
      ...ctx.request.body,
      questionId,
      answerer,
    }).save();
    ctx.body = answer;
  }

  async checkAnswerer(ctx, next) {
    const { answer } = ctx.state;
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, "没有权限！");
    }
    await next();
  }

  async update(ctx) {
    ctx.verifyParams({
      content: { type: "string", required: false },
    });
    await ctx.state.answer.update(ctx.request.body);
    ctx.body = ctx.state.answer;
  }

  async delete(ctx) {
    await Answer.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }

  async listFollowers(ctx) {
    const user = await User.find({ followingAnswers: ctx.params.id });
    ctx.body = user;
  }

  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select("+questioner");
    if (!answer) {
      ctx.throw(404, "答案不存在！");
    }
    // 只有删改查答案才检查此逻辑，赞、踩答案时候不检查
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, "改问题下没有此答案！");
    }
    ctx.state.answer = answer;
    await next();
  }
}

module.exports = new AnswerController();
