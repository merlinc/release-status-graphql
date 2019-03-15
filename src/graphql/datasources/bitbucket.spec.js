const Bitbucket = require('./bitbucket');

describe('datasources bitbucket', () => {
  it('should exist', () => {
    const bitbucket = new Bitbucket();

    expect(bitbucket).toBeDefined();
  });
});
