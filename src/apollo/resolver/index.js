// Provide resolver functions for your schema fields
const { sequelize } = require('../../model/index.js');

const resolvers = {
  Query: {
    books: () => 'books',
    hello: () => 'Hello world!',
    dashboards: async () => {
      const dashboards = await sequelize.models.Dashboards.findAll();

      return dashboards;
    },
    getDashBoardById: async (parent, args, context, info) => {
      const [dashboards] = await sequelize.models.Dashboards.findAll({
        where: {
          id: args.id,
        },
      });

      return dashboards;
    },
  },
};
module.exports = resolvers;
