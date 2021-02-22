const { ApolloError } = require('apollo-server');
const appConfig = require('config');

module.exports = {
  async status(parent, { org, project }, context) {
    /* eslint-disable no-param-reassign */
    context.org = org;
    context.project = project;

    const projects = appConfig.get('projects');
    const contextConfig = projects.find(projectConfig => {
      if (projectConfig.org === org && projectConfig.project === project) {
        return projectConfig;
      }
      return undefined;
    });

    if (!contextConfig) {
      return null;
    }

    context.config = contextConfig;
    /* eslint-enable no-param-reassign */

    return {
      org,
      project,
    };
  },

  async list() {
    const projects = appConfig.get('projects');

    return projects.map(item => ({
      org: item.org,
      project: item.project,
      type: item.type,
    }));
  },

  async config(parent, { org, project }) {
    const projects = appConfig.get('projects');
    const contextConfig = projects.find(projectConfig => {
      if (projectConfig.org === org && projectConfig.project === project) {
        return projectConfig;
      }
      return undefined;
    });

    if (!contextConfig) {
      return new ApolloError(`org: ${org} / project: ${project} not found`);
    }

    return contextConfig;
  },
};
