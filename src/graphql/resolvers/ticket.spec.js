jest.mock('config');

const ticketResolver = require('./ticket');

describe('resolvers', () => {
  describe('Ticket', () => {
    describe('id', () => {
      it('should return number', () => {
        expect(ticketResolver.id({ number: 1234 })).toEqual(1234);
      });
    });

    describe('status', () => {
      it('should return state', () => {
        expect(
          ticketResolver.status({ number: 1234, state: 'in review' })
        ).toEqual('in review');
      });
    });

    describe('title', () => {
      it('should return number', () => {
        expect(ticketResolver.title({ title: 'Fix issues' })).toEqual(
          'Fix issues'
        );
      });
    });
  });
});
