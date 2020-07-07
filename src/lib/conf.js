const config = require('config');
const _ = require('lodash');
const R = require('ramda');

const find = function find(org, project) {
  return _.find(
    config.get('projects'),
    item => item.org === org && item.project === project
  );
};

const merge = function merge(base, defaults) {
  if (!_.has(base, 'extends')) {
    return base;
  }

  const result = _.reduce(
    base.extends,
    (acc, value) => {
      if (!_.has(defaults, value)) {
        return acc;
      }

      return R.mergeDeepLeft(acc, defaults[value]);
    },
    base
  );

  return result;
};

const load = function load({ org, project }) {
  const base = find(String(org), project);

  if (!config.has('defaults')) {
    return base;
  }

  return merge(base, config.get('defaults'));
};

const list = function list() {
  const projects = config.get('projects');

  if (!config.has('defaults')) {
    return projects;
  }

  const defaults = config.get('defaults');

  const result = projects.map(project => {
    return merge(project, defaults);
  });

  return result;
};

module.exports = {
  find,
  list,
  load,
  merge,
};
