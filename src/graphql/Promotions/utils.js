const compareFn = function compare(a, b) {
  if (a.committer_date < b.committer_date) return 1;
  if (a.committer_date > b.committer_date) return -1;
  if (a.build_num < b.build_num) return 1;
  if (a.build_num > b.build_num) return -1;

  return 0;
};

const filterFn = projectPromotions => thing =>
  thing.workflows &&
  thing.workflows.job_name &&
  projectPromotions.includes(thing.workflows.job_name);

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

module.exports = {
  compareFn,
  filterFn,
  transform
};
