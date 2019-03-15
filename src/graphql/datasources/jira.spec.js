const Jira = require('./jira');

describe('datasources jira', () => {
  it('should exist', () => {
    const jira = new Jira();

    expect(jira).toBeDefined();
  });
});
