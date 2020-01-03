const { createTestClient } = require('apollo-server-testing');
// eslint-disable-next-line import/no-extraneous-dependencies
const gql = require('graphql-tag');
const createServer = require('./utils');

// const nock = require('nock');

// const {constructTestServer} = require('./__utils');

// the mocked REST API data
// const {mockLaunchResponse} = require('../datasources/__tests__/launch');
// the mocked SQL DataSource store
// const {mockStore} = require('../datasources/__tests__/user');

const GET_STATUS = gql`
  query status($org: String!, $project: String!) {
    status(org: $org, project: $project) {
      project
      commits {
        message
        sha
        url
        commits {
          sha
          author {
            date
            name
            email
          }
          committer {
            date
            name
            email
          }
          message
        }
        promotions {
          buildId
          env
          rough
          status
          timestamp
          url
        }
      }
    }
  }
`;

describe('Queries', () => {
  it('fetches list of statuses', async () => {
    // create an instance of ApolloServer that mocks out context, while reusing
    // existing dataSources, resolvers, and typeDefs.
    // This function returns the server instance as well as our dataSource
    // instances, so we can overwrite the underlying fetchers
    const server = createServer({
      context: () => ({ org: 'merlinc', project: 'release-status-testbed' })
    });

    // use our test server as input to the createTestClient fn
    // This will give us an interface, similar to apolloClient.query
    // to run queries against our instance of ApolloServer
    const { query } = createTestClient(server);
    const res = await query({
      query: GET_STATUS,
      variables: { org: 'merlinc', project: 'release-status-testbed' }
    });
    expect(res).toMatchSnapshot({
      extensions: expect.any(Object)
    });
  });
});
