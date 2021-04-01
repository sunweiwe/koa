const router = new Router({ prefix: '/api/rest/form' });
const { secret } = require('../config/index.js');
const Router = require('koa-router');
const jwt = require('koa-jwt');
const auth = jwt({ secret });

const { find } = require('../controller/form');

router.get('/', auth, find);

module.exports = router;
