const Jenkins = require('./jenkins');

describe('datasources jenkins', () => {
  it('should exist', () => {
    const jenkins = new Jenkins();

    expect(jenkins).toBeDefined();
  });
});
