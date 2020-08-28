const Question = require("../models/questions");
const User = require("../models/users");

class QuestionController {
  async find(ctx) {
    const { page_size = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const pageSize = Math.max(page_size * 1, 1);
    const q = new RegExp(ctx.query.q);
    ctx.body = await Question.find({ $or: [{ title: q }, { description: q }] })
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
    const Question = await Question.findById(ctx.params.id)
      .select(selectFields)
      .populate("questioner topics");
    ctx.body = Question;
  }

  async create(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: true },
      description: { type: "string", required: false },
    });

    const Question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id,
    }).save();
    ctx.body = Question;
  }

  async checkQuestioner(ctx, next) {
    const { question } = ctx.state;
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, "没有权限！");
    }
    await next();
  }

  async update(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: false },
      description: { type: "string", required: false },
    });
    await ctx.state.question.update(ctx.request.body);
    ctx.body = ctx.state.question;
  }

  async delete(ctx) {
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }

  async listFollowers(ctx) {
    const user = await User.find({ followingQuestions: ctx.params.id });
    ctx.body = user;
  }
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select(
      "+questioner"
    );
    if (!Question) {
      ctx.throw(404, "问题不存在！");
    }
    ctx.state.question = question;
    await next();
  }
}

module.exports = new QuestionController();
