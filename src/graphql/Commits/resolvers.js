module.exports = {
  async getByProject(org, project, config, githubAPI) {
    return githubAPI.getCommitsForProject({ org, project, config });
  }
};
