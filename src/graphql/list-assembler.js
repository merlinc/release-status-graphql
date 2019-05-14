// const config = require('config');

module.exports = {
  load: config => {
    return config.map(item => ({
      org: item.org,
      project: item.project,
      type: item.type
    }));
  }
};
