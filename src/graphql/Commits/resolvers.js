const { mapGithubCommit} = require('./utils');

module.exports = {
  mapGithubCommit,

  async getByProject(org, project, githubAPI) {
    return githubAPI.getCommitsForProject({ org, project });
  }
};
