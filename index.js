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
const routing = require('./src/routes');
const db = require('./src/model/index.js');
const typeDefs = require('./src/apollo/schema/index');
const resolvers = require('./src/apollo/resolver/index');

const server = new ApolloServer({ typeDefs, resolvers });
const app = new Koa();
server.applyMiddleware({ app });

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

  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
});
