const jsonfile = require('jsonfile');
const utils = require('./utils');

describe('Promotions utils', () => {

  describe('transform', () => {
    it('should remap properties', async () => {
      const release = await jsonfile.readFile('./mock/circleci/release.json');
      const transformed = utils.transform(release);

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
        utils.compareFn({ committer_date: 100 }, { committer_date: 101 })
      ).toEqual(1);
    });

    it('should sort later commiter_date as -1', () => {
      expect(
        utils.compareFn({ committer_date: 100 }, { committer_date: 99 })
      ).toEqual(-1);
    });

    it('should sort equal committer_date as 0', () => {
      expect(
        utils.compareFn({ committer_date: 100 }, { committer_date: 100 })
      ).toEqual(0);
    });

    it('should sort lower build_num as 1', () => {
      expect(
        utils.compareFn({ build_num: 99 }, { build_num: 100 })
      ).toEqual(1);
    });
    it('should sort higher build_num as -1', () => {
      expect(
        utils.compareFn({ build_num: 100 }, { build_num: 99 })
      ).toEqual(-1);
    });
    it('should sort equal build_num as 0', () => {
      expect(
        utils.compareFn({ build_num: 100 }, { build_num: 100 })
      ).toEqual(0);
    });

    it.skip('should prioritise committer_date over build_num', () => {});
  });
});
