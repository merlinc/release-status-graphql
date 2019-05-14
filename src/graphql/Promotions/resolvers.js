// const config = require('config');
// const _ = require('lodash');
const { compareFn, filterFn } = require('./utils');

const getProjectPromotions = configObj => {
  if (!configObj || !configObj.promotions) {
    return [];
  }

  const { promotions } = configObj;

  return promotions;
};

// const getByProject = async (config, circleCIAPI, travisCIAPI) => {
const getByProject = async (config, circleCIAPI) => {
  const projects1 = await circleCIAPI.getSomething({
    org: config.org,
    project: config.project,
    config
  });

  const projects2 = await circleCIAPI.getSomething({
    org: config.org,
    project: config.project,
    offset: 100,
    config
  });

  const data = projects1.concat(projects2);

  const projectPromotions = config.promotions || [];

  return data.filter(filterFn(projectPromotions)).sort(compareFn);
};

module.exports = {
  getProjectPromotions,
  getByProject
};
