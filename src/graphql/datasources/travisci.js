const { RESTDataSource } = require('apollo-datasource-rest');

const utils = require('../utils');

class TravisCIAPI extends RESTDataSource {
  constructor({ name, auth, urls }) {
    console.log('TRavis');
    super();

    this.auth = auth;
    this.urls = urls;
    this.name = name;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', `token ${this.auth.token}`);
    request.headers.set('Travis-API-Version', '3');
  }

  async getDeployments({ org, project, config, commitSha }) {
    let data;
    try {
      const url = `${this.urls.base}/${org}%2F${project}/builds?branch=master&build.commit.ref=${commitSha}`;
      data = await this.get(url);

      // console.log(`${Object.keys(data)}`);
      // console.log(`length: ${data.builds.length}`);
      // console.log(JSON.stringify(data.builds[0], null, 2));
      // console.log(data);
      // data = await this.get(
      //   `${this.urls.base}/${org}%2F${project}/builds?branch.name=master&includes=event_type`
      //   // {
      //   //   cacheOptions: {
      //   //     ttl: 60,
      //   //   },
      //   //   cacheKey: 'etag',
      //   // }
      // );

      // console.log(JSON.stringify(data));
      // console.log(data.filter(build => !build.last_build_id));
    } catch (e) {
      console.log(e);
    }

    console.log(`searching sha: ${commitSha} - ${data.length}`);

    const filtered = data.builds.filter(build => {
      // console.log(
      //   `${build.commit.sha} - ${build.commit.message} - ${build.commit.ref}`
      // );
      return build.commit.sha === commitSha;
    });

    console.log(`${data.length} - ${filtered.length}`);
    // console.log(JSON.stringify(data, null, 2));

    const projectPromotions = config.promotions.jobs || [];

    const allPromotions = data
      .filter(utils.filterFn(projectPromotions))
      .sort(utils.compareFn);

    const result = allPromotions.filter(p => p.vcs_revision === commitSha);
    return result;
  }
}

module.exports = TravisCIAPI;
