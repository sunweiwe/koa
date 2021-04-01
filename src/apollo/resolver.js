const path = require('path');
const fs = require('fs');
const { merge } = require('lodash');

let resolvers = {};

const rootPath = path.join(__dirname, './resolver');

fs.readdirSync(rootPath).forEach((resolver) => {
  merge(resolvers, require(path.join(rootPath, resolver)));
});

module.exports = resolvers;
