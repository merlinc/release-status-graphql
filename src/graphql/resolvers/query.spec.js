jest.mock('config');

const appConfig = require('config');
const queryResolver = require('./query');

describe('resolvers', () => {
  describe('Query', () => {
    describe('status', () => {
      let configData;
      beforeEach(() => {
        configData = {
          projects: [
            {
              org: 'merlinc',
              project: 'release-status-testing',
              type: 'web',
            },
          ],
        };
        appConfig.get = jest.fn().mockReturnValueOnce(configData.projects);
      });

      it('should return org and project', async () => {
        const result = await queryResolver.status(
          {},
          { org: 'merlinc', project: 'release-status-testing' },
          {}
        );

        expect(result.org).toEqual('merlinc');
        expect(result.project).toEqual('release-status-testing');
      });

      it('should add org and project to context', async () => {
        const context = {};

        await queryResolver.status(
          {},
          { org: 'merlinc', project: 'release-status-testing' },
          context
        );

        expect(context.org).toEqual('merlinc');
        expect(context.project).toEqual('release-status-testing');
      });

      it('should add config to context', async () => {
        const context = {};
        await queryResolver.status(
          {},
          { org: 'merlinc', project: 'release-status-testing' },
          context
        );

        expect(context.config).toEqual(configData.projects[0]);
      });
    });

    describe('list', () => {
      let configListData;
      beforeEach(() => {
        configListData = [
          {
            org: 'merlinc',
            project: 'release-status-testing',
            type: 'web',
            extends: ['github'],
          },
          {
            org: 'merlinc',
            project: 'release-status-graphql',
            type: 'web',
            extends: ['github'],
          },
        ];

        appConfig.get = jest.fn().mockReturnValueOnce(configListData);
      });

      it('should return all data', async () => {
        const result = await queryResolver.list();

        expect(result.length).toBe(2);
      });

      it('should transform data', async () => {
        const result = await queryResolver.list();

        expect(result).toEqual([
          {
            org: 'merlinc',
            project: 'release-status-testing',
            type: 'web',
          },
          {
            org: 'merlinc',
            project: 'release-status-graphql',
            type: 'web',
          },
        ]);
      });
    });

    describe('config', () => {
      let configItemData;
      beforeEach(() => {
        configItemData = [
          {
            org: 'merlinc',
            project: 'release-status-testing',
            type: 'web',
          },
        ];

        appConfig.get = jest.fn().mockReturnValueOnce(configItemData);
      });

      it('should return org and project', async () => {
        const result = await queryResolver.status(
          {},
          { org: 'merlinc', project: 'release-status-testing' },
          {}
        );

        expect(result.org).toEqual('merlinc');
        expect(result.project).toEqual('release-status-testing');
      });
    });
  });
});
