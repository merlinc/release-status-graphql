const resolvers = require('./resolvers');

describe('resolvers', () => {
  it('should contain all resolvers', () => {
    expect(resolvers).toHaveProperty('Commit');
    expect(resolvers).toHaveProperty('Config');
    expect(resolvers).toHaveProperty('GitObject');
    expect(resolvers).toHaveProperty('Promotion');
    expect(resolvers).toHaveProperty('Query');
    expect(resolvers).toHaveProperty('Status');
    expect(resolvers).toHaveProperty('Ticket');
  });
});
