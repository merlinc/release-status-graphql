jest.mock('config');

const configResolver = require('./config');

describe('resolvers', () => {
  describe('Config', () => {
    describe('promotions', () => {
      it('should jobs', () => {
        expect(
          configResolver.promotions({
            promotions: {
              connection: 'circleci-public',
              jobs: [
                'build',
                'deploy_integration',
                'deploy_staging',
                'deploy_prod',
              ],
            },
          })
        ).toEqual([
          'build',
          'deploy_integration',
          'deploy_staging',
          'deploy_prod',
        ]);
      });
    });
  });
});
