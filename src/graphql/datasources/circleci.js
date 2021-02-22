const { RESTDataSource } = require('apollo-datasource-rest');

const utils = require('../utils');

class CircleCIAPI extends RESTDataSource {
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

  async getDeployments({ org, project, offset = 0, config, commitSha }) {
    const data = await this.get(
      `${this.urls.base}/${org}/${project}/tree/master`,
      {
        limit: 100,
        filter: 'completed',
        offset,
      },
      {
        cacheOptions: {
          ttl: 60,
        },
        cacheKey: 'etag',
      }
    );

    const projectPromotions = config.promotions.jobs || [];

    const allPromotions = data
      .filter(utils.filterFn(projectPromotions))
      .sort(utils.compareFn);

    const result = allPromotions.filter(p => p.vcs_revision === commitSha);
    return result;
  }
}

module.exports = CircleCIAPI;
