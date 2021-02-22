jest.mock('config');

const commitResolver = require('./commit');

describe('resolvers', () => {
  describe('Commit', () => {
    describe('message', () => {
      it('should return correctly', () => {
        expect(
          commitResolver.message({ commit: { message: 'lorem' } })
        ).toEqual('lorem');
      });
    });

    describe('commitType', () => {
      it('should return single for one commit', () => {
        expect(
          commitResolver.commitType({
            parents: ['sha1'],
          })
        ).toEqual('single');
      });

      it('should return merge for two commits', () => {
        expect(
          commitResolver.commitType({
            parents: ['sha1', 'sha2'],
          })
        ).toEqual('merge');
      });

      it('should return octopus for three commits', () => {
        expect(
          commitResolver.commitType({
            parents: ['sha1', 'sha2', 'sha3'],
          })
        ).toEqual('octopus');
      });

      it('should return single for no commit', () => {
        expect(
          commitResolver.commitType({
            parents: [],
          })
        ).toEqual('single');
      });
    });

    describe('tickets', () => {
      it('should null with a missing commit sha', async () => {
        expect(
          await commitResolver.tickets({ commit: { message: 'lorem' } })
        ).toEqual(null);
      });
    });
  });
});
