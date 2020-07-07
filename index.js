const fs = require('fs');
const { RedisCache } = require('apollo-server-cache-redis');

const responseCachePlugin = require('apollo-server-plugin-response-cache');

const config = require('config');

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
const {
  GraphQLErrorTrackingExtension
} = require('graphql-error-tracking-extension');

const typeDefs = gql(
  fs.readFileSync(__dirname.concat('/src/graphql/typedefs.graphql'), 'utf8')
);

const resolvers = require('./src/graphql/resolvers');

// Fixme: On Startup, loop over all datasources defined in config
// then create them - this will allow multiple circleci endpoints to be used

const GithubAPI = require('./src/graphql/datasources/github-cacheable');
const CircleCIAPI = require('./src/graphql/datasources/circleci');
// const ClubhouseAPI = require('./src/graphql/datasources/clubhouse');
// const GitlabAPI = require('./src/graphql/datasources/gitlab');
// const TravisCIAPI = require('./src/graphql/datasources/travisci');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [responseCachePlugin()],
  cache: new RedisCache({
    host: config.settings['redis-host']
    // Options are passed through to the Redis client
  }),
  dataSources: () => ({
    circleCIAPI: new CircleCIAPI(),
    githubAPI: new GithubAPI()
    // travisCIAPI: new TravisCIAPI(),
    // clubhouseAPI: new ClubhouseAPI(),
    // gitlabAPI: new GitlabAPI()
  }),
  extensions: [() => new GraphQLErrorTrackingExtension()],
  tracing: true,
  formatError: error => {
    // console.log("Error:>");
    // console.log(Object.keys(error));
    // console.log(error.message, error.locations, error.path);
    return error;
  },
  formatResponse: response => {
    // console.log("Response:>");
    // console.log(JSON.stringify(response, null, 2));
    return response;
  },
  context: ({ req }) => ({
    request: req
  })
});

server.listen({ port: config.settings.port }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`✨ Server ready at ${url}`);
});
