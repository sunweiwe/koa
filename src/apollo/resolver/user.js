const { sequelize } = require('../../model/index.js');

const resolvers = {
  Query: {
    getAllUsers: async () => {
      const users = await sequelize.models.User.findAll();
      return users;
    },
  },
  Mutation: {
    addUser: async (_, { user }, context, info) => {
      await sequelize.models.User.create(user);
      return user;
    },
  },
};
module.exports = resolvers;
