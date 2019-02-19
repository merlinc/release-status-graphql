const R = require('ramda');
const config = require('config');
const octokit = require('@octokit/rest')();

octokit.authenticate({
  type: 'token',
  token: config.get('api.github.token')
});

const commitMessageLens = R.lensPath(['commit', 'message']);

const mapGithubCommit = R.converge(R.merge, [
  R.pick(['sha', 'url']),
  // I guess this should be a function that works on a GitCommit to return message, committer/date and tree/sha
  // or maybe tree/sha isgit p parents?
  R.pipe(
    R.view(commitMessageLens),
    R.objOf('message')
  )
]);

module.exports = {
  mapGithubCommit,

  async getByProject(org, project) {
    try {
      const commits = await octokit.repos.listCommits({
        owner: org,
        repo: project,
        sha: 'master'
      });
      return commits.data;
    } catch (e) {
      // console.log(e);
      return [];
    }

    // return {
    //     sha: '100'
    // };
  }
};
