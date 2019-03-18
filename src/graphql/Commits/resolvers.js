module.exports = {
  async getByProject(org, project, githubAPI) {
    return githubAPI.getCommitsForProject({ org, project });
  }
};
