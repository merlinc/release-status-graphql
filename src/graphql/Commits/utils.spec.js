const R = require('ramda');

const utils = require('./utils');

describe('Commits utils', () => {
  let commit;
  beforeEach(() => {
    commit = {
      sha: 'abcde',
      url:'http://example.org',
      commit: {
        message: 'Lorem Ipsum'
      }
    }
  });

  describe('commitMessageLens', () => {
    it('should pullout the message property', () => {
      const result = R.view(utils.commitMessageLens)(commit);

      expect(result).toEqual('Lorem Ipsum');
    });
  });

  describe('mapGithubCommit', () => {
    it('should map github commit', () => {
      const result = utils.mapGithubCommit(commit);

      expect(result).toEqual(expect.objectContaining({
        sha: 'abcde',
        url: 'http://example.org',
        message: 'Lorem Ipsum'
      }))
    })
  })
});
