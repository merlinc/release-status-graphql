const fs = require('fs');

// bootstrap config
// load config
// load projects config

/*
In a nutshell: define only external source connection settings in files,
using those settings to connect to the source. Once connected, read
additional configurations and add them to the config object returned
from require('config');.

Make sure any external overrides are done in the application bootstrap -
before anyone calls the first config.get();, because the config object is
made immutable as soon as any client uses the values via get().

*/

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
