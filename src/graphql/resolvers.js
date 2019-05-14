const _ = require('lodash');
const statusAssembler = require('./status-assembler');
const configAssembler = require('./config-assembler');
const listAssembler = require('./list-assembler');
const confLib = require('../lib/conf');

const resolvers = {
  Query: {
    async status(root, { org, project }, { dataSources }) {
      const conf = confLib.load(org, project);
      const result = await statusAssembler.load({ dataSources, config: conf });
      result.org = org;
      result.project = project;
      return _.omit(result, ['config']);
    },

    async list() {
      const conf = confLib.list();
      return listAssembler.load(conf);
    },

    async config(parent, { org, project }) {
      const conf = confLib.load(org, project);
      return configAssembler.load(conf);
    }
  }
};

module.exports = resolvers;
