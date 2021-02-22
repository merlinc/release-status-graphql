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

module.exports = {
  compareFn,
  filterFn,
};
