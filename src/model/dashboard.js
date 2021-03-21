'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dashboards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Dashboards.init(
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
      modelName: 'Dashboards',
    }
  );
  return Dashboards;
};
