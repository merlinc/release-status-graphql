const config = require('config');
const _ = require('lodash');

module.exports = {
  load: (org, project) =>
    _.find(
      config.get('projects'),
      item => item.org === org && item.project === project
    )
};
