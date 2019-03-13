const jsonfile = require('jsonfile');
const resolvers = require('./resolvers');

describe('Promotions resolvers', () => {
  let release;

  beforeEach(async () => {
    release = await jsonfile.readFile('./mock/circleci/release.json');
    // console.log(release);
  });

  describe('transform', () => {
    it('should remap properties', () => {
      const transformed = resolvers.transform(release);

      expect(transformed).toEqual({
        buildId: 5517,
        env: 'client_deploy_staging',
        rough: false,
        timestamp: '2019-02-27T13:28:10.756Z',
        git_ref: '8a2f6fc14fb8f6ecff68aa50f88be8867702b080',
        git_subject: 'Update all non-major dependencies (#76)',
        url: 'https://circleci.com/gh/lorem/ipsum/5517'
      });
    });
  });

  describe('compareFn', () => {
    it('should sort earlier committer_date as 1', () => {
      expect(
        resolvers.compareFn({ committer_date: 100 }, { committer_date: 101 })
      ).toEqual(1);
    });

    it('should sort later commiter_date as -1', () => {
      expect(
        resolvers.compareFn({ committer_date: 100 }, { committer_date: 99 })
      ).toEqual(-1);
    });

    it('should sort equal committer_date as 0', () => {
      expect(
        resolvers.compareFn({ committer_date: 100 }, { committer_date: 100 })
      ).toEqual(0);
    });

    it('should sort lower build_num as 1', () => {
      expect(
        resolvers.compareFn({ build_num: 99 }, { build_num: 100 })
      ).toEqual(1);
    });
    it('should sort higher build_num as -1', () => {
      expect(
        resolvers.compareFn({ build_num: 100 }, { build_num: 99 })
      ).toEqual(-1);
    });
    it('should sort equal build_num as 0', () => {
      expect(
        resolvers.compareFn({ build_num: 100 }, { build_num: 100 })
      ).toEqual(0);
    });

    it.skip('should prioritise committer_date over build_num', () => {});
  });

  describe('getProjectPromotions', () => {
    it.skip('should return project promotions from config', () => {});
    it.skip('should return an empty array for no / invalid config', () => {});
  });

  describe('getByProject', () => {});
});
