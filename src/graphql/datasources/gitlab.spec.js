const Gitlab = require('./gitlab');

describe('datasources gitlab', () => {
  it('should exist', () => {
    const gitlab = new Gitlab();

    expect(gitlab).toBeDefined();
  });
});
