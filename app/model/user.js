const moment = require("moment");
const { sequelize } = require("./index");
const { Sequelize, Model } = require("sequelize");

class User extends Model {}

User.init(
  {
    // id sequelize 默认创建...
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
      // unique: truemvcjgyfig
    },
    password: {
      type: Sequelize.STRING,
      comment: "通过 bcrypt 加密后的密码", // 仅限站内注册用户
    },
    email: {
      type: Sequelize.STRING(50),
    },
    notice: {
      type: Sequelize.BOOLEAN, // 是否开启邮件通知
      defaultValue: true,
    },
    role: {
      type: Sequelize.TINYINT,
      defaultValue: 2,
      comment: "用户权限：1 - admin, 2 - 普通用户",
    },
    github: {
      type: Sequelize.TEXT, // github 登录用户 直接绑定在 user 表
    },
    disabledDiscuss: {
      type: Sequelize.BOOLEAN, // 是否禁言
      defaultValue: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      get() {
        return moment(this.getDataValue("createdAt")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      get() {
        return moment(this.getDataValue("updatedAt")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      },
    },
  },
  {
    timestamps: true,
    sequelize,
    modelName: "user",
    tableName: "user",
  }
);

module.exports = User;
