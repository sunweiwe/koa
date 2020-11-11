const Router = require('koa-router');
const router = new Router({ prefix: '/api/rest/users' });

const jwt = require('koa-jwt');
const { secret } = require('../config/index.js');

const { find, findById, create } = require('../controllers/users');

// const auth = jwt({ secret });

router.get('/', find);

router.get('/:id', findById);

router.post('/', create);

module.exports = router;
