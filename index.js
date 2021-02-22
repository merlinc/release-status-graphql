const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const { RedisCache } = require('apollo-server-cache-redis');
const responseCachePlugin = require('apollo-server-plugin-response-cache');
const appConfig = require('config');
const { mapValues, has, reject, isNil } = require('lodash');

const GithubAPI = require('./src/graphql/datasources/github-cacheable');
const CircleCIAPI = require('./src/graphql/datasources/circleci');

const typeDefs = gql(
  fs.readFileSync(__dirname.concat('/src/graphql/typedefs.graphql'), 'utf8')
);

const resolvers = require('./src/graphql/resolvers');

// Create datasource lookups
const datasourceMap = {
  circleci: CircleCIAPI,
  'github-cacheable': GithubAPI,
};

const datasources = reject(
  mapValues(appConfig.get('connections'), (value, key) => {
    if (has(datasourceMap, value.datasource)) {
      return new datasourceMap[value.datasource]({
        name: key,
        auth: value.auth,
        urls: value.urls,
      });
    }

    // eslint-disable-next-line no-console
    console.log(`${key} - ${value.datasource} not found`);
    return undefined;
  }),
  isNil
);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [responseCachePlugin()],
  cache: new RedisCache({
    host: appConfig.settings['redis-host'],
    // Options are passed through to the Redis client
  }),
  dataSources: () => datasources,
  tracing: true,
  formatError: error => {
    // console.log('Error:>');
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
    request: req,
  }),
});

server.listen({ port: appConfig.settings.port }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`✨ Server ready at ${url}`);
});
