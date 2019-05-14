const resolvers = require('./resolvers');

const statusAssembler = require('./status-assembler');
// const configAssembler = require('./config-assembler');
// const listAssembler = require('./list-assembler');

jest.mock('./status-assembler');
// jest.mock('./config-assembler');
// jest.mock('./list-assembler');

describe('graphql resolvers', () => {
  it('should have a Query', () => {
    expect(resolvers.Query).toBeDefined();
  });

  describe('status', () => {
    it.skip('should call statusAssembler', async () => {
      const dataSources = {
        data: jest.fn()
      };

      await resolvers.Query.status(
        'root',
        { org: 'org', project: 'project' },
        { dataSources }
      );

      expect(statusAssembler.load).toHaveBeenCalledWith(
        'org',
        'project',
        dataSources
      );
    });
  });
});
