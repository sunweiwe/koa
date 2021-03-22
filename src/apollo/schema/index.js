// Construct a schema, using GraphQL schema language

const { gql } = require('apollo-server-koa');
const typeDefs = gql`
  type Dashboard {
    id: ID
    title: String
    content: String
    desc: String
    tag: String
    createBy: String
    modifyBy: String
  }

  type Query {
    books: String
    hello: String
    dashboards: [Dashboard]
    getDashBoardById(id: ID!): Dashboard
  }
`;
module.exports = typeDefs;
