// This is a copy of the root index.js
// FIXME: Refactor

const fs = require('fs');

const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql(
  fs.readFileSync(
    __dirname.concat('/../../src/graphql/typedefs.graphql'),
    'utf8'
  )
);
const resolvers = require('../../src/graphql/resolvers');

const CircleCIAPI = require('../../src/graphql/datasources/circleci');
const ClubhouseAPI = require('../../src/graphql/datasources/clubhouse');
const GithubAPI = require('../../src/graphql/datasources/github-cacheable');
const TravisCIAPI = require('../../src/graphql/datasources/travisci');

const createServer = context => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      circleCIAPI: new CircleCIAPI(),
      travisCIAPI: new TravisCIAPI(),
      clubhouseAPI: new ClubhouseAPI(),
      githubAPI: new GithubAPI()
    }),
    tracing: true,
    context
  });
};

module.exports = createServer;
