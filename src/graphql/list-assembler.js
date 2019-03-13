const config = require('config');

module.exports = {
  load: () =>
    config.get('projects').map(item => ({
      org: item.org,
      project: item.project,
      type: item.type
    }))
};
