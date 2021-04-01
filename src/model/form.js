'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    static associate(models) {}
  }

  Form.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      desc: DataTypes.STRING,
      tag: DataTypes.STRING,
      createBy: DataTypes.STRING,
      modifyBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Form',
    },
  );
  return Form;
};
