const config = require('config');
const Octokit = require('@octokit/rest');

const { DataSource } = require('apollo-datasource');

// This is not cached, that is setup by default on a RESTDataSource
class GithubAPI extends DataSource {
  constructor() {
    super();
    this.octokit = Octokit({
      log: console,
      auth: `token ${config.get('api.github.token')}`,
    });
  }

  async getCommitsForProject({ org, project }) {
    const commits = await this.octokit.repos.listCommits({
      owner: org,
      repo: project,
      sha: 'master',
    });

    return commits.data;
  }

  async getPullsForProject({ org, project }) {
    const pulls = await this.octokit.pulls.list({
      owner: org,
      repo: project,
      state: 'closed',
    });

    return pulls.data;
  }
}

module.exports = GithubAPI;

/*

  If merged as a merge commit, merge_commit_sha represents the SHA of the merge commit.
  If merged via a squash, merge_commit_sha represents the SHA of the squashed commit on the base branch.
  If rebased, merge_commit_sha represents the commit that the base branch was updated to.


This can be more easily done in GraphQL ...

{
  repository(owner: "merlinc", name: "release-status") {
    ref(qualifiedName: "master") {
      target {
        ... on Commit {
          id
          history(first: 5) {
            pageInfo {
              hasNextPage
            }
            edges {
              node {
                associatedPullRequests(first: 5) {
                  edges {
                    node {
                      id
                      number
                      title
                      body
                      author {
                        login
                      }
                    }
                  }
                }
                messageHeadline
                oid
                message
                author {
                  name
                  email
                  date
                }
              }
            }
          }
        }
      }
    }
  }
}

*/
