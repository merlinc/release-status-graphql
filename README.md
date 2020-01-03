# Release Status

Release Status is a dashboard to show you what you have, and would like to release. It does this by combining information from your git, build, and bug tracking systems.

It currently supports Github and CircleCI.

It is an reworking of [UKHomeOffice/passport-ticket-status](https://github.com/UKHomeOffice/passports-ticket-status) to provide a API agnostic backend API written in GraphQL, and a SSR frontend application using Next.JS

This particular repository is the GraphQL backend.

## Example screenshots

### Without ticket information

![without-tickets](https://user-images.githubusercontent.com/196695/57960002-600cf900-78fe-11e9-9e2a-c4e9c02f2cee.png)

### With linked ticket information

![tickets](https://user-images.githubusercontent.com/196695/57960001-5f746280-78fe-11e9-9366-548b66ec35b1.png)

## Quality Metrics

### Codescene

[![](https://codescene.io/projects/4875/status.svg) Get more details at **codescene.io**.](https://codescene.io/projects/4875/jobs/latest-successful/results)

### Coveralls

[![Coverage Status](https://coveralls.io/repos/github/merlinc/release-status-graphql/badge.svg?branch=master)](https://coveralls.io/github/merlinc/release-status-graphql?branch=master)

## Glossary

- Ticket - A story task representing work to do
- Commits - Entries made into a git system, which may refer to one or more tickets
- Build - A discrete package of code consisting of at least one commit.
- Deploy - A placement of a build into an environment

## Running

`npm run start` or `npm run start:watch` to reload when changes are made.

## Running in Docker

This can be started from the frontend project using `docker-compose` or standalone.

In both cases a configuration file needs to be attached as a volume, matching this pattern:

```
// - path_outside_container:path_inside_container
  - ${CONFIG_FILE}:/src/config/default.json
```

## Config

An example config has been provided, the most important part is the project config:

```json
{
  "projects": [
    {
      "org": "facebook",
      "project": "react",
      "type": "library",
      "promotions": ["staging", "production"]
    }
  ]
}
```

This config defined a github project of `facebook/react` with two promotion states, `staging` and production`.

API keys should also be provided as follows:

```json
{
  "api": {
    "circleCI": {
      "token": "CIRCLECI_TOKEN_GUID"
    },
    "github": {
      "token": "GITHUB_TOKEN_GUID"
    }
  }
}
```

## Tests

Run `npm test`
