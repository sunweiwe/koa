const Router = require('koa-router');
const router = new Router({ prefix: '/api/rest' });

const { login } = require('../controllers/users');

router.post('/login', login);

module.exports = router;
