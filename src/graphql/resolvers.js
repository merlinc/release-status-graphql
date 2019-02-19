const config = require('config');

const _ = require('lodash');
// const logger = require('../logger').child({
//   module: 'graphql:resolvers'
// });

const assembler = require('./assembler');

const resolvers = {
  Query: {
    async status(root, { org, project }, { dataSources }) {
      // logger.info(Object.keys(dataSources));

      return assembler.load(org, project, dataSources);
    },

    async list() {
      return config.get('projects').map(item => ({
        org: item.org,
        project: item.project,
        type: item.type
      }));
    },

    async config(parent, { org, project }) {
      // logger.info({ org, project });

      const configObj = _.find(
        config.get('projects'),
        item => item.org === org && item.project === project
      );

      return configObj;
    }
  }
};

module.exports = resolvers;
