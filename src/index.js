const { ApolloServer, gql } = require('apollo-server-koa');
const session = require('koa-generic-session');
const bodyparser = require('koa-body');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const koaStatic = require('koa-static');
const redisStore = require('koa-redis');
const Koa = require('koa');
const path = require('path');

/**
 *
 */
const auth = require('./utils/auth');

// 启动端口
const port = 4000;

/**
 * restful
 * 路由
 */
const routing = require('./routes');

/**
 * mysql config
 */
const db = require('./model/index.js');

const typeDefs = require('./apollo/typeDefs.js');
const resolvers = require('./apollo/resolver.js');

/**
 * apollo server
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: true,
  bodyParserConfig: true,
  // mocks: true,
  tracing: true,
  formatError: (error) => {
    return {
      code: error.extensions.code,
      message: error.message,
    };
  },
  context: ({ ctx: { request } }) => {
    // TODO auth
    const token = request.headers.authorization || '';
    // const user = getUser(token);
    // if (!user) throw new AuthenticationError('you must be logged in');
    // return { user };
  },
});

/**
 *  向apollo server注入 koa
 */
const app = new Koa();
server.applyMiddleware({ app });

app.keys = ['keys', ''];

/**
 * session
 */
app.use(
  session({
    store: redisStore({}),
  }),
);

/**
 * restful 文件上传中间件
 */
app.use(koaStatic(path.join(__dirname, 'public')));

/**
 * 格式化错误日志输出
 */
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  }),
);

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

/**
 * body parser
 */
app.use(
  bodyparser({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'),
      keepExtensions: true,
    },
  }),
);

/**
 * 中间件
 * 校验参数
 */
app.use(parameter(app));

/**
 * 注册路由
 */
routing(app);

/**
 *
 */
app.listen(port, async () => {
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

  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
});
