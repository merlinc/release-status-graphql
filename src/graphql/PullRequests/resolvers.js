module.exports = {
  async getByProject(org, project, config, githubAPI) {
    return githubAPI.getPullsForProject({ org, project, config });
  }
};
