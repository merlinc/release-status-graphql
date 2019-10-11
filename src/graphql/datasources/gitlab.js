const { RESTDataSource } = require('apollo-datasource-rest');

class GitLabAPI extends RESTDataSource {

  async getCommitsForProject({ org, project }) {
    const commits = await this.get(
      `https://gitlab.com/api/v4/projects/${org}%2F${project}/repository/commits`,
      {},
      {
        cacheOptions: {
          ttl: 10
        },
        cacheKey: 'etag'
      }
    );

    return commits.map(item => ({
      sha: item.id,
      message: item.message,
      date: item.commited_date,
      author: item.author_name
    }));
  }
}

module.exports = GitLabAPI;
