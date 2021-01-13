```js
const mongoose = require('mongoose');

mongoose.connect(
  connectionStr,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log('mongodb 连接成功！');
  }
);
mongoose.connection.on('error', console.error);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || err.statusCode || 500;
    ctx.body = {
      message: err.message,
    };
  }
});
```
