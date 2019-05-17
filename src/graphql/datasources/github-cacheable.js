const configX = require('config');

const { RESTDataSource } = require('apollo-datasource-rest');
const { Headers } = require('apollo-server-env');

class GithubAPI extends RESTDataSource {
  willSendRequest(request) {
    const token = Buffer.from(
      `${configX.get('api.github.token')}:`,
      'ascii'
    ).toString('base64');

    request.headers.set('Authorization', `Basic ${token}`);
    request.headers.set('Accept', 'application/json');
  }

  async getCommitsForProject({ org, project, config }) {
    const headers = new Headers();
    headers.set('Authorization', `Basic ${config.git.auth.token}:`);
    headers.set('Accept', 'application/json');

    const commits = await this.get(
      `${config.git.apiUrl}/repos/${org}/${project}/commits`,
      {
        sha: 'master'
      },
      {
        headers,
        cacheOptions: {
          ttl: 10
        },
        cacheKey: 'etag'
      }
    );

    return commits;
  }

  async getPullsForProject({ org, project, config }) {
    const headers = new Headers();
    headers.set('Authorization', `Basic ${config.git.auth.token}:`);
    headers.set('Accept', 'application/json');

    const pulls = await this.get(
      `${config.git.apiUrl}/repos/${org}/${project}/pulls`,
      {
        base: 'master',
        state: 'closed',
        sort: 'updated',
        direction: 'desc'
      },
      {
        headers,
        cacheOptions: {
          ttl: 10
        },
        cacheKey: 'etag'
      }
      // }
    );

    return pulls;
  }
}

module.exports = GithubAPI;