const configX = require('config');

const { RESTDataSource } = require('apollo-datasource-rest');
const { Headers } = require('apollo-server-env');

class CircleCIAPI extends RESTDataSource {
  willSendRequest(request) {
    const token = Buffer.from(
      `${configX.get('api.circleCI.token')}:`,
      'ascii'
    ).toString('base64');

    request.headers.set('Authorization', `Basic ${token}`);
    request.headers.set('Accept', 'application/json');
  }

  async getSomething({ org, project, offset = 0, config }) {
    const data = await this.get(
      `${config.releases.baseUrl}/${org}/${project}/tree/master`,
      {
        limit: 100,
        filter: 'completed',
        offset
      },
      {
        headers: new Headers({
          Accept: 'application/json',
          Authorization: `Basic ${config.releases.auth.token}:`
        }),
        HEADERS: {
          Accept: 'application/json',
          Authorization: `Basic ${config.releases.auth.token}:`
        },
        cacheOptions: {
        ttl: 60
      },
      cacheKey: 'etag'
    }
    );
    return data;
  }
}

module.exports = CircleCIAPI;
