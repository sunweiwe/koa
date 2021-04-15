'use strict';
const { Model, UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    static associate(models) {}
  }

  Form.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4, //
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
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
