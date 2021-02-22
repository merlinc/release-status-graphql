const Query = require('./resolvers/query');
const Status = require('./resolvers/status');
const Commit = require('./resolvers/commit');
const GitObject = require('./resolvers/gitobject');
const Promotion = require('./resolvers/promotion');
const Ticket = require('./resolvers/ticket');
const Config = require('./resolvers/config');

const resolvers = {
  Commit,
  Config,
  GitObject,
  Promotion,
  Query,
  Status,
  Ticket,
};

module.exports = resolvers;
