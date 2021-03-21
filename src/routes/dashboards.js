const Router = require('koa-router');
const router = new Router({ prefix: '/api/rest/dashboard' });

const jwt = require('koa-jwt');
const { secret } = require('../config/index.js');
const auth = jwt({ secret });

const { find } = require('../controller/dashboard');

router.get('/', auth, find);

module.exports = router;
