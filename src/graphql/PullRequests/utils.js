const R = require('ramda');

// const commitMessageLens = R.lensPath(['commit', 'message']);

/*

id
title
body
number
user.login
merge_commit_sha
head.sha
base.sha

 */
const mapPullRequest = R.converge(R.merge, [
  R.pick(['id', 'title', 'body', 'number', 'merge_commit_sha']),
  // I guess this should be a function that works on a GitCommit to return message, committer/date and tree/sha
  // or maybe tree/sha isgit p parents?
  // R.pipe(
  //   R.view(commitMessageLens),
  //   R.objOf('message')
  // )
]);

module.exports = {
  // commitMessageLens,
  mapPullRequest
};
