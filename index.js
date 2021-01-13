const Koa = require('koa');
const path = require('path');
const bodyparser = require('koa-body');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const koaStatic = require('koa-static');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');

const routing = require('./routes');
const db = require('./models/index.js');

const app = new Koa();

app.keys = ['keys', ''];

app.use(
  session({
    store: redisStore({}),
  }),
);

app.use(koaStatic(path.join(__dirname, 'public')));

app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  }),
);

app.use(
  bodyparser({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'),
      keepExtensions: true,
    },
  }),
);

app.use(parameter(app));
routing(app);

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

app.listen(3000, async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  db.sequelize
    .sync({ force: false, logging: false })
    .then(async () => {})
    .catch((err) => {
      console.log(err);
    });
  console.log('程序已启动！');
});
