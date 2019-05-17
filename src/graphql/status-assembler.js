const R = require('ramda');

const promotion = require('./Promotions/resolvers');
const promotionUtils = require('./Promotions/utils');
const commit = require('./Commits/resolvers');
const gitUtils = require('./Commits/utils');
const pullRequests = require('./PullRequests/resolvers');

const getCommits = async function getCommits({ config, dataSources }) {
  const commits = await commit.getByProject(
    config.org,
    config.project,
    config,
    dataSources.githubAPI
  );
  return { config, dataSources, commits };
};

const getPullRequests = async function getPullRequests({
  config,
  dataSources,
  ...rest
}) {
  const prs = await pullRequests.getByProject(
    config.org,
    config.project,
    config,
    dataSources.githubAPI
  );

  return { config, dataSources, prs, ...rest };
};

const mapPullRequests = async function mapPullRequests({
  prs,
  commits,
  ...rest
}) {
  const filteredPRs = prs.filter(pr => {
    return commits.some(c => {
      return c.sha === pr.merge_commit_sha;
    });
  });

  const result = {
    prs: filteredPRs,
    commits,
    ...rest
  };

  return result;
};

const mapCommits = async function mapCommits({ commits, ...rest }) {
  return {
    commits: commits.map(gitUtils.mapGithubCommit),
    ...rest
  };
};

const mapPromotions = async function mapPromotions({ promotions, ...rest }) {
  return {
    promotions: promotions.map(promotionUtils.transform),
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
  config,
  ids,
  dataSources,
  ...rest
}) {
  const promotions = await promotion.getByProject(
    config,
    dataSources.circleCIAPI,
    dataSources.travisCIAPI
  );

  return {
    config,
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

const groupTickets = function groupTickets({ prs, ...rest }) {
  const tickets = prs.map(pr => {
    return {
      id: pr.number,
      title: pr.title,
      body: pr.body,
      status: pr.state,
      merges: [
        {
          mergeId: pr.merge_commit_sha
        }
      ]
    };
  });

  return {
    tickets,
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

const load = async function load({ dataSources, config }) {
  return R.pipeP(
    getCommits,
    getPullRequests,
    mapPullRequests,
    getPromotions,
    mapCommits,
    mapPromotions,
    groupPromotions,
    groupTickets
  )({ dataSources, config });
};

module.exports = {
  load,
  getCommits,
  mapCommits,
  mapPromotions,
  pullCommitIds,
  getPromotions,
  pullPromotionIds,
  groupPromotions
};
