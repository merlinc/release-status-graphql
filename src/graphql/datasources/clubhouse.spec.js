const Clubhouse = require('./clubhouse');

describe('datasources clubhouse', () => {
  it('should exist', () => {
    const clubhouse = new Clubhouse();

    expect(clubhouse).toBeDefined();
  });
});
