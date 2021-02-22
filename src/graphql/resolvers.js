const { ApolloError } = require('apollo-server');
const appConfig = require('config');

const findDataSource = ({ name, dataSources }) => {
  return dataSources.find(o => {
    return o.name === name;
  });
};

const resolvers = {
  Query: {
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
  },
  Status: {
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

      // console.log(result);
      return result;
    },
  },

  Commit: {
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
  },

  GitObject: {
    message(obj) {
      return obj.message;
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
    id(parent) {
      return parent.number;
    },

    status(parent) {
      return parent.state;
    },

    title(parent) {
      return parent.title;
    },
  },

  Config: {
    promotions(parent) {
      return parent.promotions.jobs;
    },
  },
};

module.exports = resolvers;
