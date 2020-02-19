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
              project: 'release-status-testing',
              type: 'web'
            }
          ]
        };

        confLib.load = jest.fn().mockReturnValueOnce(configData);
      });

      it('should return org and project', async () => {
        const result = await resolvers.Query.status(
          {},
          { org: 'merlinc', project: 'release-status-testing' },
          {}
        );

        expect(result.org).toEqual('merlinc');
        expect(result.project).toEqual('release-status-testing');
      });

      it('should add org and project to context', async () => {
        const context = {};

        await resolvers.Query.status(
          {},
          { org: 'merlinc', project: 'release-status-testing' },
          context
        );

        expect(context.org).toEqual('merlinc');
        expect(context.project).toEqual('release-status-testing');
      });

      it('should add config to context', async () => {
        const context = {};
        await resolvers.Query.status(
          {},
          { org: 'merlinc', project: 'release-status-testing' },
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
            project: 'release-status-testing',
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
            project: 'release-status-testing',
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

    describe('config', () => {
      let configItemData;
      beforeEach(() => {
        configItemData = {
          org: 'merlinc',
          project: 'release-status-testing',
          type: 'web'
        };

        confLib.load = jest.fn().mockReturnValueOnce(configItemData);
      });

      it('should return org and project', async () => {
        const result = await resolvers.Query.status(
          {},
          { org: 'merlinc', project: 'release-status-testing' },
          {}
        );

        expect(result.org).toEqual('merlinc');
        expect(result.project).toEqual('release-status-testing');
      });
    });
  });

  describe('Promotion', () => {
    describe('buildId', () => {
      it('should return correctly', () => {
        expect(resolvers.Promotion.buildId({ build_num: 100 })).toEqual(100);
      });
    });

    describe('env', () => {
      it('should return correctly if present', () => {
        expect(
          resolvers.Promotion.env({ workflows: { job_name: 'staging_deploy' } })
        ).toEqual('staging_deploy');
      });

      it('should return dashed if not present', () => {
        expect(resolvers.Promotion.env({})).toEqual('----');
      });
    });

    describe('rough', () => {
      it('should return correctly', () => {
        expect(resolvers.Promotion.rough({ status: 'success' })).toBeFalsy();
      });
    });

    describe('timestamp', () => {
      it('should return correctly', () => {
        expect(
          resolvers.Promotion.timestamp({ start_time: '20200101' })
        ).toEqual('20200101');
      });
    });

    describe('url', () => {
      it('should return correctly', () => {
        expect(
          resolvers.Promotion.url({ build_url: 'http://example.org' })
        ).toEqual('http://example.org');
      });
    });
  });

  describe('Ticket', () => {
    describe('id', () => {
      it('should return correctly', () => {
        expect(resolvers.Ticket.id({ number: 100 })).toEqual(100);
      });
    });

    describe('status', () => {
      it('should return correctly', () => {
        expect(resolvers.Ticket.status({ state: 'ok' })).toEqual('ok');
      });

      describe('merges', () => {
        it('should return correctly', () => {
          expect(
            resolvers.Ticket.merges({ merge_commit_sha: 'abcdef' })
          ).toEqual([{ mergeId: 'abcdef' }]);
        });
      });
    });
  });
});
