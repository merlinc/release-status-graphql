jest.mock('config');

const { ApolloError } = require('apollo-server');

const appConfig = require('config');
const queryResolver = require('./query');

describe('resolvers', () => {
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

  describe('Query', () => {
    describe('status', () => {
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

      it('should return null if config not found', async () => {
        const context = {};
        const result = await queryResolver.status(
          {},
          { org: 'merlinc', project: 'release-status-nonexistent' },
          context
        );

        expect(result).toBeNull();
      });
    });

    describe('list', () => {
      it('should return all data', async () => {
        const result = await queryResolver.list();

        expect(result).toEqual([
          {
            org: 'merlinc',
            project: 'release-status-testing',
            type: 'web',
          },
        ]);
      });
    });

    describe('config', () => {
      it('should return org and project', async () => {
        const result = await queryResolver.config(
          {},
          { org: 'merlinc', project: 'release-status-testing' },
          {}
        );

        expect(result.org).toEqual('merlinc');
        expect(result.project).toEqual('release-status-testing');
      });

      it('should return an Apollo error if org not found', async () => {
        const result = await queryResolver.config(
          {},
          { org: 'merlinc-notfound', project: 'release-status-testing' },
          {}
        );

        expect(result).toBeInstanceOf(ApolloError);
        expect(result.message).toEqual(
          'org: merlinc-notfound / project: release-status-testing not found'
        );
      });
      it('should return an Apollo error if project not found', async () => {
        const result = await queryResolver.config(
          {},
          { org: 'merlinc', project: 'release-status-nonexistent' },
          {}
        );

        expect(result).toBeInstanceOf(ApolloError);
        expect(result.message).toEqual(
          'org: merlinc / project: release-status-nonexistent not found'
        );
      });
    });
  });
});
