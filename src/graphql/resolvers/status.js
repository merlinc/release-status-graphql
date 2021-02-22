const { findDataSource } = require('../utils');

module.exports = {
  async commits(parent, _, { org, project, config, dataSources }) {
    const dataSource = findDataSource({
      name: config.scm.connection,
      dataSources,
    });
    if (!dataSource) {
      return null;
    }

    const result = await dataSource.getCommitsForProject({
      org,
      project,
      config,
    });

    return result;
  },
};
