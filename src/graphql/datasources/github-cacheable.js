const { RESTDataSource } = require('apollo-datasource-rest');

class GithubAPI extends RESTDataSource {
  constructor({ name, auth, urls }) {
    super();

    this.auth = auth;
    this.urls = urls;
    this.name = name;
  }

  willSendRequest(request) {
    const token = Buffer.from(this.auth.token, 'ascii').toString('base64');

    request.headers.set('Authorization', `Basic ${token}`);
    request.headers.set('Accept', 'application/json');
  }

  async getCommitsForProject({ org, project }) {
    const commits = await this.get(
      `${this.urls.api}/repos/${org}/${project}/commits`,
      {
        sha: 'master',
      },
      {
        cacheOptions: {
          ttl: 60,
        },
        cacheKey: 'etag',
      }
    );
    return commits;
  }

  async getPullsForProject({ org, project, commitSha }) {
    const pulls = await this.get(
      `${this.urls.api}/repos/${org}/${project}/pulls`,
      {
        base: 'master',
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
      },
      {
        cacheOptions: {
          ttl: 60,
        },
        cacheKey: 'etag',
      }
    );

    return pulls.filter(pull => pull.merge_commit_sha === commitSha);
  }
}

module.exports = GithubAPI;
