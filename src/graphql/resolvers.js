const statusAssembler = require('./status-assembler');
const configAssembler = require('./config-assembler');
const listAssembler = require('./list-assembler');

const resolvers = {
  Query: {
    async status(root, {org, project}, {dataSources}) {
      // logger.info(Object.keys(dataSources));

      return statusAssembler.load(org, project, dataSources);
    },

    async list() {
      return listAssembler.load();
    },

    async config(parent, {org, project}) {
      return configAssembler.load(org, project);
    }
  }
};

module.exports = resolvers;
