const R = require('ramda');

// const release = require('./Builds/resolvers');
const promotion = require('./Promotions/resolvers');
// const ticket = require('./Tickets/resolvers');
const commit = require('./Commits/resolvers');

// const debug = function debug(data) {
//   console.log(Object.keys(data));
// };

const getCommits = async function getCommits({ org, project, dataSources }) {
  const commits = await commit.getByProject(org, project);
  return { org, project, dataSources, commits };
};

const mapCommits = async function mapCommits({ commits, ...rest }) {
  return {
    commits: commits.map(commit.mapGithubCommit),
    ...rest
  };
};

const mapPromotions = async function mapPromotions({ promotions, ...rest }) {
  return {
    promotions: promotions.map(promotion.transform),
    ...rest
  };
};

const pullCommitIds = function pullCommitIds({ commits, ...rest }) {
  return {
    commits,
    ids: {
      commits: commits.map(c => c.sha)
    },
    ...rest
  };
};

const getPromotions = async function getPromotions({
  org,
  project,
  ids,
  dataSources,
  ...rest
}) {
  const promotions = await promotion.getByProject(
    org,
    project,
    dataSources.circleCIAPI
  );

  return {
    org,
    project,
    ids,
    promotions,
    ...rest
  };
};

const pullPromotionIds = function pullPromotionIds({
  promotions,
  ids,
  ...rest
}) {
  return {
    promotions,
    ids: {
      ...ids,
      promotions: promotions.map(p => p.build_num)
    },
    ...rest
  };
};

const groupPromotions = function groupPromotions({
  promotions,
  commits,
  ids,
  ...rest
}) {
  const updatedCommits = commits.map(c => {
    /* eslint-disable-next-line no-param-reassign */
    c.promotions = promotions.filter(p => p.git_ref === c.sha);

    return c;
  });

  return {
    commits: updatedCommits,
    promotions,
    ids,
    ...rest
  };
};

/* Original loading order:
  // done => this.getBuilds(data, project, done),
  // done => this.getTickets(data, project, done);
  // done => this.getBuildStatuses(data, project, done),
  // done => this.getPromotions(data, project, done),
  // done => this.getBuildPromotions(data, project, done),
  // done => this.getRoughBuildPromotions(data, project, done),
  // done => this.getBuildUpdatedModules(data, project, done),
  // done => this.mergeDuplicateTickets(data, done)
  */

const load = async function load(org, project, dataSources) {
  return R.pipeP(
    getCommits,
    pullCommitIds,
    getPromotions,
    pullPromotionIds,

    /*
        getPullRequestsForCommits

        */

    mapCommits,
    mapPromotions,
    groupPromotions
  )({ org, project, dataSources });
};

module.exports = {
  load
};
