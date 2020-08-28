const Topic = require("../models/topics");
const User = require("../models/users");
const Question = require("../models/questions");

class TopicController {
  async find(ctx) {
    const { page_size = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const pageSize = Math.max(page_size * 1, 1);
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) })
      .limit(pageSize)
      .skip(page * pageSize);
  }

  async findById(ctx) {
    const topic = await Topic.findById(ctx.params.id).select("+introduction");
    ctx.body = topic;
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });

    const topic = await new Topic(ctx.request.body).save();
    ctx.body = topic;
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });
    const topic = await Topic.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    );
    ctx.body = topic;
  }

  async listFollowers(ctx) {
    const user = await User.find({ followingTopics: ctx.params.id });
    ctx.body = user;
  }
  async checkTopicExist(ctx, next) {
    const topic = await Topic.findById(ctx.params.id);
    if (!topic) {
      ctx.throw(404, "话题不存在！");
    }
    await next();
  }

  async listQusetions(ctx) {
    const questions = await Question.find({ topics: ctx.params.id });
    ctx.body = questions;
  }
}

module.exports = new TopicController();
