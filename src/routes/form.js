const { secret } = require('../config/index.js');
const Router = require('koa-router');
const jwt = require('koa-jwt');
const auth = jwt({ secret });

const router = new Router({ prefix: '/api/rest/form' });

const { findAll, create, update, destroy } = require('../controller/form');

router.get('/', auth, findAll);

router.post('/', auth, create);

router.post('/:id', auth, update);

router.delete('/:id', auth, destroy);

module.exports = router;
