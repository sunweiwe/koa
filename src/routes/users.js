const Router = require('koa-router');
const router = new Router({ prefix: '/api/rest/user' });

const jwt = require('koa-jwt');
const { secret } = require('../config/index.js');
const auth = jwt({ secret });

const { find, findById, create, deleteUser } = require('../controller/user');

router.get('/', auth, find);

router.get('/:id', auth, findById);

router.post('/', create);

router.delete('/:id', auth, deleteUser);

module.exports = router;
