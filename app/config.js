module.exports = {
  // connectionStr:'mongodb+srv://sun:sun123..@cluster0-z8k7l.mongodb.net/test?retryWrites=true&w=majority',
  secret: "koa-login-token-jwt",
  connectionStr: "mongodb://localhost/koa",
  DATABASE: {
    database: "node",
    user: "root",
    password: "3er4#ER$",
    options: {
      host: "localhost", // 连接的 host 地址
      dialect: "mysql", // 连接到 mysql
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: false, // 默认不加时间戳
        freezeTableName: true, // 表名默认不加 s
      },
      timezone: "+08:00",
    },
  },
};
