const config = require('config');
const _ = require('lodash');
const { compareFn, filterFn } = require('./utils');

const getProjectPromotions = ({ org, project }) => {
  const configObj = _.find(
    config.get('projects'),
    item =>
      // console.log(item);
      item.org === org && item.project === project
  );

  if (!configObj || !configObj.promotions) {
    return [];
  }

  const { promotions } = configObj;

  return promotions;
};

const getByProject = async (org, project, circleCIAPI) => {
  const projects1 = await circleCIAPI.getSomething({ org, project });
  const projects2 = await circleCIAPI.getSomething({
    org,
    project,
    offset: 100
  });
  const projects3 = await circleCIAPI.getSomething({
    org,
    project,
    offset: 200
  });
  const projects4 = await circleCIAPI.getSomething({
    org,
    project,
    offset: 300
  });

  const data = projects1.concat(projects2.concat(projects3.concat(projects4)));

  // const data = projects1;
  // console.log(JSON.stringify(data[0], null, 2));

  const projectPromotions = getProjectPromotions({ org, project });

  return data.filter(filterFn(projectPromotions)).sort(compareFn);
};

module.exports = {
  getProjectPromotions,
  getByProject
};
