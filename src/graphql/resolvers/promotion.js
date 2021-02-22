module.exports = {
  buildId(obj) {
    return obj.build_num;
  },

  env(obj) {
    return obj.workflows && obj.workflows.job_name
      ? obj.workflows.job_name
      : '----';
  },

  rough(obj) {
    return obj.status !== 'success';
  },

  timestamp(obj) {
    return obj.start_time;
  },

  url(obj) {
    return obj.build_url;
  },
};
