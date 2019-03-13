const config = require('config');
const Octokit = require('@octokit/rest');

const { DataSource } = require('apollo-datasource');

class GithubAPI extends DataSource {
  constructor() {
    super();
    this.octokit = Octokit({
      auth: `token ${config.get('api.github.token')}`
    });
  }

  async getCommitsForProject({ org, project }) {
    const commits = await this.octokit.repos.listCommits({
      owner: org,
      repo: project,
      sha: 'master'
    });
    return commits.data;
  }
}

module.exports = GithubAPI;
