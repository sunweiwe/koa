const Router = require("koa-router");
const router = new Router({ prefix: "/api/rest/users" });

const jwt = require("koa-jwt");

const { secret } = require("../config");

const { find, findById, createUser } = require("../controller/user");

const {
  // find,
  // findById,
  delete: del,
  update,
  create,
  login,
  checkOwner,
  listFollowing,
  follow,
  unfollow,
  listFollowers,
  checkUserExist,
  followTopic,
  unfollowTopic,
  listFollowingTopics,
  listQuestions,

  // 赞的接口
  listLikingAnswers,
  likeAnswer,
  unlikeAnswer,
  // 踩的接口
  listDislikeLikingAnswers,
  dislikeAnswer,
  undislikeAnswer,
} = require("../controllers/users");
const { checkTopicExist } = require("../controllers/topic");
const { checkAnswerExist } = require("../controllers/answer");

// const auth = async (ctx, next) => {
//   const { authorization = "" } = ctx.request.header;
//   const token = authorization.replace("Bearer ", "");
//   try {
//     const user = jsonwebtoken.verify(token, secret);
//     ctx.state.user = user;
//   } catch (err) {
//     ctx.throw(401, err.message);
//   }
//   await next();
// };

const auth = jwt({ secret });

router.get("/", find);

router.post("/", createUser);

router.get("/:id", findById);

router.patch("/:id", auth, checkOwner, update);

router.delete("/:id", auth, checkOwner, del);

router.post("/login", login);

router.get("/:id/following", listFollowing);

router.put("/following/:id", auth, checkUserExist, follow);

router.delete("/following/:id", auth, checkUserExist, unfollow);

router.get("/:id/follower", listFollowers);

router.get("/:id/followingTopic", listFollowingTopics);

router.put("/followingTopic/:id", auth, checkTopicExist, followTopic);

router.delete("/followingTopic/:id", auth, checkTopicExist, unfollowTopic);

router.get("/:id/questions", listQuestions);

// 赞
router.get("/:id/likingAnswers", listLikingAnswers);

router.put(
  "/likingAnswers/:id",
  auth,
  checkAnswerExist,
  likeAnswer,
  undislikeAnswer
);

router.delete("/likingAnswers/:id", auth, checkAnswerExist, unlikeAnswer);

// 踩;
router.get("/:id/dislikingAnswers", listDislikeLikingAnswers);

router.put(
  "/dislikingAnswers/:id",
  auth,
  checkAnswerExist,
  dislikeAnswer,
  unlikeAnswer
);

router.delete("/dislikingAnswers/:id", auth, checkAnswerExist, undislikeAnswer);

module.exports = router;
