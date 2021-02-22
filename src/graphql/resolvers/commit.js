const { findDataSource } = require('../utils');

module.exports = {
  message(parent) {
    return parent.commit.message;
  },

  commitType(parent) {
    if (parent.parents.length > 2) {
      return 'octopus';
    }

    if (parent.parents.length > 1) {
      return 'merge';
    }

    return 'single';
  },

  async promotions(commit, args, { config, dataSources }) {
    const dataSource = findDataSource({
      name: config.promotions.connection,
      dataSources,
    });
    if (!dataSource) {
      return null;
    }

    const projects1 = await dataSource.getDeployments({
      org: config.org,
      project: config.project,
      config,
      commitSha: commit.sha,
    });

    return projects1;
  },

  async tickets(commit, args, { org, project, config, dataSources }) {
    const { sha } = commit;

    const dataSource = findDataSource({
      name: config.tickets.connection,
      dataSources,
    });
    if (!dataSources) {
      return null;
    }

    const results = await dataSource.getPullsForProject({
      org,
      project,
      config,
      commitSha: sha,
    });

    return results;
  },

  commits(parent) {
    // console.log(Object.keys(parent));
    // console.log(Object.keys(parent.parents));
    return parent.parents;
  },
};
