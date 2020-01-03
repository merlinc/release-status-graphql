const { Polly } = require('@pollyjs/core');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');

// Register the node http adapter so its accessible by all future polly instances
Polly.register(NodeHttpAdapter);
// Register the fs persister so its accessible by all future polly instances
Polly.register(FSPersister);

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
  let polly;
  beforeEach(() => {
    polly = new Polly('Basic Integration', {
      adapters: ['node-http'],
      persister: 'fs',
      persisterOptions: {
        fs: {
          recordingsDir: '__recordings__'
        }
      }
    });

    const { server } = polly;
    server.any().on('beforePersist', (req, recording) => {
      // Don't save authorization headers
      // eslint-disable-next-line no-param-reassign
      recording.request.headers = recording.request.headers.filter(
        ({ name }) => name !== 'authorization'
      );
    });
  });

  afterEach(async () => {
    await polly.stop();
  });

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
