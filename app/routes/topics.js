const Router = require("koa-router");
const router = new Router({ prefix: "/api/rest/topics" });
const jwt = require("koa-jwt");
const { secret } = require("../config");

const {
  find,
  create,
  update,
  checkTopicExist,
  listFollowers,
  listQusetions
} = require("../controllers/topic");

const auth = jwt({ secret })

router.get('/', find)

router.post('/', auth, create)

router.patch("/:id", auth, checkTopicExist,update)

router.get("/:id/followers",checkTopicExist, listFollowers)

router.get("/:id/questions",checkTopicExist, listQusetions)





module.exports = router;
