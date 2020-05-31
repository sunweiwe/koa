const Router = require("koa-router");
const router = new Router({ prefix: "/api/rest/questions" });
const jwt = require("koa-jwt");
const { secret } = require("../config");

const {
  find,
  create,
  findById,
  update,
  checkQuestionExist,
  checkQuestioner,
  delete: del
} = require("../controllers/question");

const auth = jwt({ secret })

router.get('/', find)

router.post('/', auth, create)

router.get("/:id", auth, checkQuestionExist, findById)

router.patch("/:id", auth, checkQuestionExist, checkQuestioner, update)

router.delete("/:id", auth, checkQuestionExist, checkQuestioner, del)





module.exports = router;
