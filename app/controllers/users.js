const User = require("../models/users");
const Question = require("../models/questions");
const Answer = require("../models/answers");

const jsonwebtoken = require("jsonwebtoken");

const { secret } = require("../config");

class UsersController {
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403), "没有权限";
    }
    await next();
  }

  async find(ctx) {
    const { page_size = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const pageSize = Math.max(page_size * 1, 1);
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(pageSize)
      .skip(page * pageSize);
  }

  async findById(ctx) {
    const { fields = "" } = ctx.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const populatedStr = fields
      .split(";")
      .filter((f) => f)
      .map((f) => {
        if (f === "employments") {
          return "employments.company employments.job";
        }
        if (f === "educations") {
          return "educations.school educations.major";
        }
        return f;
      })
      .join(" ");
    const user = await await User.findById(ctx.params.id)
      .select(selectFields)
      .populate(populatedStr);

    if (!user) {
      ctx.throw(404, "用户不存在！");
    }
    ctx.body = user;
  }

  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
      password: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      gender: { type: "string", required: false },
      headline: { type: "string", required: false },
      locations: { type: "array", itemType: "string", required: false },
      business: { type: "string", required: false },
      employments: { type: "array", itemType: "object", required: false },
      educations: { type: "array", itemType: "object", required: false },
    });
    const { name } = ctx.request.body;
    const repeatUser = await User.findOne({ name });
    if (repeatUser) {
      ctx.throw(409, "用户已经存在！");
    }
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: false },
      password: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      gender: { type: "string", required: false },
      headline: { type: "string", required: false },
      locations: { type: "array", itemType: "string", required: false },
      business: { type: "string", required: false },
      employments: { type: "array", itemType: "object", required: false },
      educations: { type: "array", itemType: "object", required: false },
    });

    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, "用户不存在！");
    }
    ctx.body = user;
  }

  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在！");
    }
    ctx.status = 204;
  }

  async login(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });

    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, "用户名或者密码不正确！");
    }
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: "1d" });
    ctx.body = { token };
  }

  async listFollowing(ctx) {
    const user = (
      await User.findById(ctx.params.id).select("+following")
    ).populate("following");
    if (!user) {
      ctx.throw(404);
    }
    ctx.body = user;
  }

  async listFollowers(ctx) {
    const user = await User.find({ following: ctx.params.id });
    if (!user) {
      ctx.throw(404);
    }
    ctx.body = user;
  }

  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    if (!me.following.map((id) => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }

  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    const index = me.following
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }

  async listFollowingTopics(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+followingTopics")
      .populate("followingTopics");

    if (!user) {
      ctx.throw(404);
    }
    ctx.body = user.followingTopics;
  }

  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+followingTopics"
    );
    if (
      !me.followingTopics.map((id) => id.toString()).includes(ctx.params.id)
    ) {
      me.followingTopics.push(ctx.params.id);
      me.save();
    } else {
      ctx.throw(500, "用户已经关注！");
    }
    ctx.status = 204;
  }

  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+followingTopics"
    );
    const index = me.followingTopics
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }

  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在！");
    }
    await next();
  }

  async listQuestions(ctx) {
    const question = await Question.find({ questioner: ctx.params.id });
    ctx.body = question;
  }

  async listLikingAnswers(ctx) {
    const user = await User.findById(ctx.params.id)
      .select("+likingAnswers")
      .populate("likingAnswers");
    if (!user) {
      ctx.throw(404, "用户不存在！");
    }
    ctx.body = user.likingAnswers;
  }

  async likeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+likingAnswers");
    if (!me.likingAnswers.map((id) => id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id);
      me.save();
    }
    ctx.status = 204;
  }

  async unlikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+likingAnswers");
    const index = me.follikingAnswerslowing
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.likingAnswers.splice(index, 1);
      me.save();
    }
    ctx.status = 204;
  }
}

module.exports = new UsersController();
