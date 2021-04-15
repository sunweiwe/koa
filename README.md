## prello

- koa
- mysql
- sequelize
- redis
- koa-parameter
- apollo
- koa-body
- koa-static
- koa-json-error

### sequelize

- config, 包含配置文件,它告诉 CLI 如何连接数据库
- models,包含你的项目的所有模型

### koa-parameter

> 校验请求参数

```javascript
ctx.verifyParams({
  password: { type: 'string', required: true },
  phone: { type: 'string', required: true },
});
```
