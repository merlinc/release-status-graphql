const config = require('config');
const _ = require('lodash');

const transform = promotion => ({
  // id: ID!
  buildId: promotion.build_num,
  env:
    promotion.workflows && promotion.workflows.job_name
      ? promotion.workflows.job_name
      : '------',
  rough: promotion.status !== 'success',
  timestamp: promotion.start_time,
  git_ref: promotion.vcs_revision,
  git_subject: promotion.subject,
  url: promotion.build_url
});

const compareFn = function compare(a, b) {
  if (a.committer_date < b.committer_date) return 1;
  if (a.committer_date > b.committer_date) return -1;
  if (a.build_num < b.build_num) return 1;
  if (a.build_num > b.build_num) return -1;

  return 0;
};

const getProjectPromotions = ({ org, project }) => {
  const configObj = _.find(
    config.get('projects'),
    item =>
      // console.log(item);
      item.org === org && item.project === project
  );

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

  const projectPromotions = getProjectPromotions({ org, project });

  return data
    .filter(
      thing =>
        thing.workflows &&
        thing.workflows.job_name &&
        projectPromotions.includes(thing.workflows.job_name)
    )
    .sort(compareFn);
};

module.exports = {
  transform,
  getByProject
};
