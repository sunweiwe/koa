const Koa = require("koa");
const bodyparser = require("koa-body");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const mongoose = require("mongoose");
const koaStatic = require("koa-static");
const path = require("path");

const { connectionStr } = require("./config");

const routing = require("./routes");
const db = require("./model");

const app = new Koa();

// mongoose.connect(
//   connectionStr,
//   { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
//   () => {
//     console.log("mongodb 连接成功！");
//   }
// );
// mongoose.connection.on("error", console.error);

// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (err) {
//     ctx.status = err.status || err.statusCode || 500;
//     ctx.body = {
//       message: err.message
//     }
//   }
// })

app.use(koaStatic(path.join(__dirname, "public")));

app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest },
  })
);

app.use(
  bodyparser({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "/public/uploads"),
      keepExtensions: true,
    },
  })
);
app.use(parameter(app));
routing(app);

app.listen(30000, () => {
  db.sequelize
    .sync({ force: false, logging: false }) // If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
    .then(async () => {
      // const initData = require('./initData')
      // initData() // 创建初始化数据
      console.log("sequelize connect success");
      // console.log(`sever listen on http://127.0.0.1:${config.PORT}`)
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("程序已启动！");
});
