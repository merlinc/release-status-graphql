const config = require('config');
const listAssembler = require('./list-assembler');

jest.mock('config');

describe('list-assembler', () => {
  describe('load', () => {
    beforeEach(() => {
      config.get = jest.fn().mockReturnValue([
        {
          org: 'org',
          project: 'project',
          type: 'value',
          promotions: ['staging', 'production']
        },
        {
          org: 'org-other',
          project: 'project-other',
          type: 'value-other',
          promotions: ['ci']
        }
      ]);
    });

    it('should work', () => {
      const result = listAssembler.load();
      expect(result).toEqual(
        expect.arrayContaining([
          {
            org: 'org',
            project: 'project',
            type: 'value'
          },
          {
            org: 'org-other',
            project: 'project-other',
            type: 'value-other'
          }
        ])
      );
    });
  });
});
