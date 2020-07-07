const confLib = require('../lib/conf');
const utils = require('./utils');

const resolvers = {
  Query: {
    async status(parent, { org, project }, context) {
      /* eslint-disable no-param-reassign */
      context.org = org;
      context.project = project;
      context.config = confLib.load({ org, project });
      /* eslint-enable no-param-reassign */

      return {
        org,
        project,
      };
    },

    async list() {
      const conf = confLib.list();
      return conf.map(item => ({
        org: item.org,
        project: item.project,
        type: item.type,
      }));
    },

    async config(parent, { org, project }) {
      return confLib.load({ org, project });
    },
  },
  Status: {
    async commits(parent, _, { org, project, config, dataSources }) {
      const result = await dataSources.githubAPI.getCommitsForProject({
        org,
        project,
        config,
      });
      return result;
    },
    async tickets(parent, _, { org, project, config, dataSources }) {
      const result = await dataSources.githubAPI.getPullsForProject({
        org,
        project,
        config,
      });
      return result;
    },
  },

  Commit: {
    async promotions(obj, args, { config, dataSources }) {
      const projects1 = await dataSources.circleCIAPI.getSomething({
        org: config.org,
        project: config.project,
        config,
      });

      const projects2 = await dataSources.circleCIAPI.getSomething({
        org: config.org,
        project: config.project,
        offset: 100,
        config,
      });

      const data = projects1.concat(projects2);

      const projectPromotions = config.promotions || [];

      const allPromotions = data
        .filter(utils.filterFn(projectPromotions))
        .sort(utils.compareFn);

      const result = allPromotions.filter(p => p.vcs_revision === obj.sha);
      return result;
    },
  },

  Promotion: {
    buildId(obj) {
      return obj.build_num;
    },

    env(obj) {
      return obj.workflows && obj.workflows.job_name
        ? obj.workflows.job_name
        : '----';
    },

    rough(obj) {
      return obj.status !== 'success';
    },

    timestamp(obj) {
      return obj.start_time;
    },

    url(obj) {
      return obj.build_url;
    },
  },

  Ticket: {
    id(obj) {
      return obj.number;
    },

    status(obj) {
      return obj.state;
    },

    merges(obj) {
      return [{ mergeId: obj.merge_commit_sha }];
    },
  },
};

module.exports = resolvers;
