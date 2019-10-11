const confLib = require('../lib/conf');
const resolvers = require('./resolvers');

jest.mock('../lib/conf');

describe('resolvers', () => {
  describe('Query', () => {
    describe('status', () => {
      let configData;
      beforeEach(() => {
        configData = {
          projects: [
            {
              org: 'merlinc',
              project: 'release-status-testbed',
              type: 'web'
            }
          ]
        };

        confLib.load = jest.fn().mockReturnValueOnce(configData);
      });

      it('should return org and project', async () => {
        const result = await resolvers.Query.status(
          {},
          { org: 'lorem', project: 'ipsum' },
          {}
        );

        expect(result.org).toEqual('lorem');
        expect(result.project).toEqual('ipsum');
      });

      it('should add org and project to context', async () => {
        const context = {};

        await resolvers.Query.status(
          {},
          { org: 'lorem', project: 'ipsum' },
          context
        );

        expect(context.org).toEqual('lorem');
        expect(context.project).toEqual('ipsum');
      });

      it('should add config to context', async () => {
        const context = {};
        await resolvers.Query.status(
          {},
          { org: 'lorem', project: 'ipsum' },
          context
        );

        expect(context.config).toEqual(configData);
      });
    });

    describe('list', () => {
      let configListData;
      beforeEach(() => {
        configListData = [
          {
            org: 'merlinc',
            project: 'release-status-testbed',
            type: 'web',
            extends: ['github']
          },
          {
            org: 'merlinc',
            project: 'release-status-graphql',
            type: 'web',
            extends: ['github']
          }
        ];

        confLib.list = jest.fn().mockReturnValueOnce(configListData);
      });

      it('should return all data', async () => {
        const result = await resolvers.Query.list();

        expect(result.length).toBe(2);
      });

      it('should transform data', async () => {
        const result = await resolvers.Query.list();

        expect(result).toEqual([
          {
            org: 'merlinc',
            project: 'release-status-testbed',
            type: 'web'
          },
          {
            org: 'merlinc',
            project: 'release-status-graphql',
            type: 'web'
          }
        ]);
      });
    });
  });
});
