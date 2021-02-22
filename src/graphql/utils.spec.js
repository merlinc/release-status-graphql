const utils = require('./utils');

describe('Commits utils', () => {
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
      expect(utils.compareFn({ build_num: 99 }, { build_num: 100 })).toEqual(1);
    });
    it('should sort higher build_num as -1', () => {
      expect(utils.compareFn({ build_num: 100 }, { build_num: 99 })).toEqual(
        -1
      );
    });
    it('should sort equal build_num as 0', () => {
      expect(utils.compareFn({ build_num: 100 }, { build_num: 100 })).toEqual(
        0
      );
    });

    it.skip('should prioritise committer_date over build_num', () => {});
  });
});
