const { sequelize } = require('../../model/index.js');

const resolvers = {
  Query: {
    books: () => 'books',
    hello: () => 'Hello world!',
    /**
     *
     * @returns
     */
    forms: async () => {
      const forms = await sequelize.models.Form.findAll();

      return forms;
    },
    /**
     *
     * @param {*} parent
     * @param {*} args
     * @param {*} context
     * @param {*} info
     * @returns
     */
    getFormById: async (parent, args, context, info) => {
      const [forms] = await sequelize.models.Form.findAll({
        where: {
          id: args.id,
        },
      });

      return forms;
    },
  },
};
module.exports = resolvers;
