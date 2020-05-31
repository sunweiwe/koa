const Router = require("koa-router");
const router = new Router({ prefix: "/api/rest/questions/:questionId/answers" });
const jwt = require("koa-jwt");
const { secret } = require("../config");

const {
  find,
  create,
  findById,
  update,
  checkAnswerExist,
  checkAnswerer,
  delete: del
} = require("../controllers/answer");

const auth = jwt({ secret })

router.get('/', find)

router.post('/', auth, create)

router.get("/:id", auth, checkAnswerExist, findById)

router.patch("/:id", auth, checkAnswerExist, checkAnswerer, update)

router.delete("/:id", auth, checkAnswerExist, checkAnswerer, del)





module.exports = router;
