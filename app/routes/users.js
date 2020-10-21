const Router = require('koa-router');
const router = new Router({ prefix: '/api/rest/users' });

const jwt = require('koa-jwt');

const { secret } = require('../../config');

const { find, findById, createUser } = require('../controllers/users');

const auth = jwt({ secret });

router.get('/', find);

// router.post('/', createUser);

router.get('/:id', findById);

module.exports = router;
