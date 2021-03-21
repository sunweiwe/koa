// Provide resolver functions for your schema fields
const DashBoardController = require('../../controller/dashboard');

const resolvers = {
  Query: {
    books: () => 'books',
    hello: () => 'Hello world!',
    dashboards: () => [
      {
        title: '1',
        content: '2',
        desc: '4',
        tag: '2',
        createBy: '1',
        modifyBy: '1',
      },
    ],
  },
};
module.exports = resolvers;
