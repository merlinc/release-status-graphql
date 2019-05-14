const listAssembler = require('./list-assembler');

describe('list-assembler', () => {
  describe('load', () => {
    it('should work', () => {
      const result = listAssembler.load([
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
