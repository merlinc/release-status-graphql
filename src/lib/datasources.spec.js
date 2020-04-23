const ds = require('./datasources');

describe('lib/datasources', () => {
  describe('loadDatasources', () => {
    it('should do something with config', () => {
      const config = {
        defaults: {
          "web": {
            "type": "web"
          },
          "library": {
            "type": "library"
          },
          "github": {
            "type": "webvcs",
            "datasource": "github-cacheable",
            "git": {
              "apiUrl": "https://api.github.com",
              "baseUrl": "https://github.com/{org}/{project}",
              "commitUrl": "https://github.com/{org}/{project}/{commit}",
              "compareUrl": "https://github.com/{org}/{project}/compare/{previous}...{next}",
              "auth": {
                "token": "C0FFEE"
              }
            }
          },
          "githubPrivate": {
            "type": "webvcs",
            "datasource": "github-cacheable",
            "git": {
              "urls": {
                "api": "https://api.github.com",
                "base": "https://github.com/{org}/{project}",
                "commit": "https://github.com/{org}/{project}/{commit}",
                "compare": "https://github.com/{org}/{project}/compare/{previous}...{next}",
              },
              "auth": {
                "token": "DEC0DE"
              }
            },
            "tickets": {
              "urls": {
                "ticket": "https://github.com/{org}/{project}/issues/{id}"
              }
            }
          },
        },
        projects: [
          {
            "org": "merlinc",
            "project": "release-status-testbed",
            "type": "web",
            "extends": ["github", "circleCI.com", "ticketInPRBody"],
            "promotions": ["build","deploy_integration", "deploy_staging", "deploy_prod"]
          },
          {
            "org": "merlinc",
            "project": "release-status-graphql",
            "extends": ["githubPrivate", "web", "travisCI"],
            "doesNotExtendYet": ["ticketCommit", "ticketIsPR"]
          }
        ]
      };

      const datasources = ds.loadDatasources({config});

      expect(datasources).toEqual(['github-cacheable']);
    });
  });
});
