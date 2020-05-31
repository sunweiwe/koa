const Router = require("koa-router");
const router = new Router({ prefix: "/api/rest/users" });

const jwt = require("koa-jwt");

const { secret } = require("../config");

const {
  find,
  findById,
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
} = require("../controllers/users");
const {
  checkTopicExist
} = require("../controllers/topic");

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

const auth = jwt({ secret })



router.get("/", find);

router.post("/", create);

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

module.exports = router;
