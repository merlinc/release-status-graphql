const R = require('ramda');

const commitMessageLens = R.lensPath(['commit', 'message']);

const mapGithubCommit = R.converge(R.merge, [
  R.pick(['sha', 'url']),
  // I guess this should be a function that works on a GitCommit to return message, committer/date and tree/sha
  // or maybe tree/sha isgit p parents?
  R.pipe(
    R.view(commitMessageLens),
    R.objOf('message')
  )
]);

module.exports = {
  commitMessageLens,
  mapGithubCommit
};
