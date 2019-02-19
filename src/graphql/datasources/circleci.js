const config = require('config');

const { RESTDataSource } = require('apollo-datasource-rest');

class CircleCIAPI extends RESTDataSource {
  get baseURL() {
    return config.get('circleCI.baseUrl');
  }

  willSendRequest(request) {
    const token = Buffer.from(
      `${config.get('api.circleCI.token')}:`,
      'ascii'
    ).toString('base64');

    request.headers.set('Authorization', `Basic ${token}`);
    request.headers.set('Accept', 'application/json');
  }

  async getSomething({ org, project, offset = 0 }) {
    const data = await this.get(`${org}/${project}/tree/master`, {
      limit: 100,
      filter: 'completed',
      offset
    });

    return data;
  }
}

module.exports = CircleCIAPI;
