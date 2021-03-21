const Router = require('koa-router');
const router = new Router({ prefix: '/api/rest/users' });

const jwt = require('koa-jwt');
const { secret } = require('../config/index.js');
const auth = jwt({ secret });

const { find, findById, create, deleteUser } = require('../controller/users');

router.get('/', find);

router.get('/:id', findById);

router.post('/', create);

router.delete('/:id', deleteUser);

module.exports = router;
