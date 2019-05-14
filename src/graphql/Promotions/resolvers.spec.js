const config = require('config');
const resolvers = require('./resolvers');

jest.mock('config');

describe('Promotions resolvers', () => {
  describe('getProjectPromotions', () => {
    beforeEach(() => {
      config.get = jest.fn().mockReturnValueOnce([
        {
          org: 'org',
          project: 'project',
          key: 'value',
          promotions: ['staging', 'production']
        },
        {
          org: 'org-other',
          project: 'project-other',
          key: 'value-other',
          promotions: ['ci']
        }
      ]);
    });

    it.skip('should return project promotions from config', () => {
      resolvers.getProjectPromotions({
        org: 'org',
        project: 'project'
      });
    });

    it.skip('should return an empty array if value not found', () => {
      resolvers.getProjectPromotions({
        org: 'org-missing',
        project: 'project-project-missing'
      });
    });

    it.skip('should return an empty array for no / invalid config', () => {});
  });

  describe.skip('getByProject', async () => {
    it('should do something', async () => {
      const mockCircleCIAPI = {
        getSomething: jest.fn()
      };

      mockCircleCIAPI.getSomething.mockReturnValue([]);

      await resolvers.getByProject('org', 'project', mockCircleCIAPI);

      expect(mockCircleCIAPI.getSomething).toHaveBeenCalledTimes(4);
      expect(mockCircleCIAPI.getSomething.mock.calls[0]).toEqual([
        { org: 'org', project: 'project' }
      ]);
      expect(mockCircleCIAPI.getSomething.mock.calls[1]).toEqual([
        { org: 'org', project: 'project', offset: 100 }
      ]);
      expect(mockCircleCIAPI.getSomething.mock.calls[2]).toEqual([
        { org: 'org', project: 'project', offset: 200 }
      ]);
      expect(mockCircleCIAPI.getSomething.mock.calls[3]).toEqual([
        { org: 'org', project: 'project', offset: 300 }
      ]);
    });
  });
});
