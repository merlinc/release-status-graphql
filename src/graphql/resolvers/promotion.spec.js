jest.mock('config');

const promotionResolver = require('./promotion');

describe('resolvers', () => {
  describe('Promotion', () => {
    describe('buildId', () => {
      it('should return correctly', () => {
        expect(promotionResolver.buildId({ build_num: 100 })).toEqual(100);
      });
    });

    describe('env', () => {
      it('should return correctly if present', () => {
        expect(
          promotionResolver.env({ workflows: { job_name: 'staging_deploy' } })
        ).toEqual('staging_deploy');
      });

      it('should return dashed if not present', () => {
        expect(promotionResolver.env({})).toEqual('----');
      });
    });

    describe('rough', () => {
      it('should return correctly', () => {
        expect(promotionResolver.rough({ status: 'success' })).toBeFalsy();
      });
    });

    describe('timestamp', () => {
      it('should return correctly', () => {
        expect(promotionResolver.timestamp({ start_time: '20200101' })).toEqual(
          '20200101'
        );
      });
    });

    describe('url', () => {
      it('should return correctly', () => {
        expect(
          promotionResolver.url({ build_url: 'http://example.org' })
        ).toEqual('http://example.org');
      });
    });
  });
});
