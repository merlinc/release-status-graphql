const config = require('config');

const { RESTDataSource } = require('apollo-datasource-rest');

class TravisCIAPI extends RESTDataSource {
  get baseURL() {
    return config.get('travisCI.baseUrl');
  }

  willSendRequest(request) {
    request.headers.set(
      'Authorization',
      `token ${config.get('api.travisCI.token')}`
    );
    request.headers.set('Travis-API-Version', '3');
    request.headers.set('Accept', 'application/vnd.travis-ci.2.1+json');
  }

  async getBuildsForMaster({ org, project }) {
    const data = await this.get(`/repo/${org}%2F${project}/builds`, {
      'branch.name': 'master'
    });

    return data;
  }
}

module.exports = TravisCIAPI;
