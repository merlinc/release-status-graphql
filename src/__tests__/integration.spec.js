const { createTestClient } = require('apollo-server-testing');
// eslint-disable-next-line import/no-extraneous-dependencies
const gql = require('graphql-tag');
const createServer = require('./utils');

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
    const server = createServer({
      context: () => ({ org: 'merlinc', project: 'release-status-testbed' })
    });

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
